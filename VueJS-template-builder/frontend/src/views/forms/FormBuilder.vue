<template>
  <div class="form-builder">
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit Form' : 'Create Form' }}</h1>
      <div class="header-actions">
        <el-button @click="$router.push('/forms')">Cancel</el-button>
        <el-button type="primary" @click="saveForm" :loading="loading">
          Save Form
        </el-button>
      </div>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="container form-settings">
          <h2>Form Settings</h2>
          
          <el-form label-position="top">
            <el-form-item label="Form Name" required>
              <el-input v-model="form.name" placeholder="Enter form name" />
            </el-form-item>
            
            <el-form-item label="Description">
              <el-input
                v-model="form.description"
                type="textarea"
                rows="3"
                placeholder="Enter form description"
              />
            </el-form-item>
            
            <el-form-item>
              <el-switch
                v-model="form.isPublished"
                active-text="Published"
                inactive-text="Draft"
              />
            </el-form-item>
            
            <el-form-item label="Based on Template">
              <el-select 
                v-model="form.templateId"
                placeholder="Select template"
                clearable
                style="width: 100%"
                :disabled="isEdit"
                @change="onTemplateChange"
              >
                <el-option
                  v-for="template in templates"
                  :key="template._id"
                  :label="template.name"
                  :value="template._id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          
          <template v-if="!form.templateId">
            <h3>Available Elements</h3>
            <div class="element-palette">
              <div
                v-for="element in availableElements"
                :key="element.type"
                class="element-item"
                draggable="true"
                @dragstart="onDragStart($event, element)"
              >
                <el-tag size="large">{{ element.label }}</el-tag>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card class="container form-canvas">
          <h2>Form Layout</h2>
          
          <div
            class="form-drop-area"
            @drop="onDrop($event)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div v-if="form.elements && form.elements.length > 0" class="form-elements">
              <div
                v-for="(element, index) in form.elements"
                :key="element.id || index"
                class="form-element"
                :class="{ 'template-element': form.templateId }"
              >
                <div class="element-header">
                  <span>{{ element.label }}</span>
                  <div class="element-actions">
                    <el-button size="small" @click="editElement(index)" :disabled="form.templateId">Edit</el-button>
                    <el-button size="small" type="danger" @click="removeElement(index)" :disabled="form.templateId">Remove</el-button>
                  </div>
                </div>
                
                <div class="element-preview">
                  <!-- Text Input -->
                  <el-input 
                    v-if="element.type === 'text' || element.type === 'email' || element.type === 'password'"
                    :type="element.type"
                    :placeholder="element.placeholder"
                    disabled
                  />
                  
                  <!-- Textarea -->
                  <el-input 
                    v-else-if="element.type === 'textarea'"
                    type="textarea"
                    :rows="3"
                    :placeholder="element.placeholder"
                    disabled
                  />
                  
                  <!-- Number Input -->
                  <el-input-number 
                    v-else-if="element.type === 'number'"
                    disabled
                    controls-position="right"
                  />
                  
                  <!-- Select -->
                  <el-select
                    v-else-if="element.type === 'select'"
                    :placeholder="element.placeholder"
                    disabled
                    style="width: 100%"
                  >
                    <el-option
                      v-for="option in element.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                  
                  <!-- Radio Buttons -->
                  <el-radio-group v-else-if="element.type === 'radio'" disabled>
                    <el-radio
                      v-for="option in element.options"
                      :key="option.value"
                      :label="option.value"
                    >
                      {{ option.label }}
                    </el-radio>
                  </el-radio-group>
                  
                  <!-- Checkboxes -->
                  <el-checkbox-group v-else-if="element.type === 'checkbox'" disabled>
                    <el-checkbox
                      v-for="option in element.options"
                      :key="option.value"
                      :label="option.value"
                    >
                      {{ option.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                  
                  <!-- Date Picker -->
                  <el-date-picker
                    v-else-if="element.type === 'date'"
                    type="date"
                    :placeholder="element.placeholder || 'Select date'"
                    style="width: 100%"
                    disabled
                  />
                  
                  <!-- Time Picker -->
                  <el-time-picker
                    v-else-if="element.type === 'time'"
                    :placeholder="element.placeholder || 'Select time'"
                    style="width: 100%"
                    disabled
                  />
                  
                  <!-- File Upload -->
                  <el-upload
                    v-else-if="element.type === 'file'"
                    action="#"
                    :auto-upload="false"
                    disabled
                  >
                    <el-button type="primary" disabled>Click to upload</el-button>
                  </el-upload>
                  
                  <!-- Slider -->
                  <el-slider v-else-if="element.type === 'slider'" disabled />
                  
                  <!-- Switch -->
                  <el-switch v-else-if="element.type === 'switch'" disabled />
                  
                  <!-- Heading -->
                  <h4 v-else-if="element.type === 'heading'">{{ element.label }}</h4>
                  
                  <!-- Divider -->
                  <el-divider v-else-if="element.type === 'divider'" />
                  
                  <!-- Default case -->
                  <div v-else>{{ element.type }} element</div>
                </div>
              </div>
            </div>
            
            <div v-else-if="form.templateId && templatesLoading" class="loading-template">
              <el-skeleton :rows="5" animated />
            </div>
            
            <div v-else class="empty-form">
              <el-empty description="Drag elements here to build your form" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-dialog
      v-model="elementDialogVisible"
      :title="isEditingElement ? 'Edit Element' : 'Add Element'"
      width="50%"
    >
      <el-form label-position="top">
        <el-form-item label="Label" required>
          <el-input v-model="currentElement.label" placeholder="Enter element label" />
        </el-form-item>
        
        <el-form-item label="Name" required>
          <el-input v-model="currentElement.name" placeholder="Enter element name" />
        </el-form-item>
        
        <el-form-item label="Placeholder">
          <el-input v-model="currentElement.placeholder" placeholder="Enter placeholder text" />
        </el-form-item>
        
        <el-form-item label="Helper Text">
          <el-input v-model="currentElement.helperText" placeholder="Enter helper text" />
        </el-form-item>
        
        <el-form-item>
          <el-switch
            v-model="currentElement.required"
            active-text="Required"
            inactive-text="Optional"
          />
        </el-form-item>
        
        <el-form-item v-if="currentElement.type === 'select' || currentElement.type === 'radio' || currentElement.type === 'checkbox'">
          <h4>Options</h4>
          <div v-for="(option, index) in currentElement.options" :key="index" class="option-item">
            <el-input v-model="option.label" placeholder="Option label" />
            <el-input v-model="option.value" placeholder="Option value" />
            <el-button type="danger" icon="el-icon-delete" circle @click="removeOption(index)" />
          </div>
          <el-button type="primary" @click="addOption">Add Option</el-button>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="elementDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveElement">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'FormBuilder',
  props: {
    id: {
      type: String,
      required: false
    }
  },
  
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const form = reactive({
      name: '',
      description: '',
      elements: [],
      templateId: route.query.templateId || null,
      isPublished: false
    })
    
    const loading = computed(() => store.getters.isLoading)
    const templatesLoading = ref(false)
    const isEdit = computed(() => !!props.id)
    
    const elementDialogVisible = ref(false)
    const isEditingElement = ref(false)
    const currentElement = ref({})
    const currentElementIndex = ref(-1)
    
    const templates = computed(() => store.getters.templates)
    
    const availableElements = [
      { type: 'text', label: 'Text Input' },
      { type: 'textarea', label: 'Text Area' },
      { type: 'number', label: 'Number' },
      { type: 'email', label: 'Email' },
      { type: 'password', label: 'Password' },
      { type: 'select', label: 'Dropdown' },
      { type: 'radio', label: 'Radio Buttons' },
      { type: 'checkbox', label: 'Checkboxes' },
      { type: 'date', label: 'Date Picker' },
      { type: 'time', label: 'Time Picker' },
      { type: 'file', label: 'File Upload' },
      { type: 'slider', label: 'Slider' },
      { type: 'switch', label: 'Switch' },
      { type: 'divider', label: 'Divider' },
      { type: 'heading', label: 'Heading' }
    ]
    
    onMounted(async () => {
      // Fetch all templates
      await store.dispatch('fetchTemplates')
      
      if (props.id) {
        // Edit mode: fetch the form
        try {
          const fetchedForm = await store.dispatch('fetchFormById', props.id)
          if (fetchedForm) {
            Object.assign(form, fetchedForm)
          }
        } catch (error) {
          ElMessage.error('Failed to load form')
        }
      } else if (form.templateId) {
        // Creating form from template
        await loadTemplateElements(form.templateId)
      }
    })
    
    const loadTemplateElements = async (templateId) => {
      if (!templateId) return
      
      templatesLoading.value = true
      try {
        const template = await store.dispatch('fetchTemplateById', templateId)
        if (template && template.elements) {
          // Clone elements from template
          form.elements = template.elements.map(element => ({ ...element, id: uuidv4() }))
        }
      } catch (error) {
        ElMessage.error('Failed to load template elements')
      } finally {
        templatesLoading.value = false
      }
    }
    
    const onTemplateChange = async (templateId) => {
      if (templateId) {
        await loadTemplateElements(templateId)
      } else {
        form.elements = []
      }
    }
    
    const onDragStart = (event, element) => {
      if (form.templateId) return // Prevent dragging if using a template
      event.dataTransfer.setData('element', JSON.stringify(element))
    }
    
    const onDrop = (event) => {
      if (form.templateId) return // Prevent dropping if using a template
      
      const elementData = event.dataTransfer.getData('element')
      if (elementData) {
        const element = JSON.parse(elementData)
        
        // Create new element with default properties
        const newElement = {
          id: uuidv4(),
          type: element.type,
          label: element.label,
          name: element.type + '_' + Date.now(),
          placeholder: '',
          helperText: '',
          required: false,
          options: element.type === 'select' || element.type === 'radio' || element.type === 'checkbox' 
            ? [{ label: 'Option 1', value: 'option1' }] 
            : undefined
        }
        
        currentElement.value = { ...newElement }
        isEditingElement.value = false
        elementDialogVisible.value = true
      }
    }
    
    const editElement = (index) => {
      if (form.templateId) return // Prevent editing if using a template
      
      currentElement.value = { ...form.elements[index] }
      currentElementIndex.value = index
      isEditingElement.value = true
      elementDialogVisible.value = true
    }
    
    const removeElement = (index) => {
      if (form.templateId) return // Prevent removing if using a template
      form.elements.splice(index, 1)
    }
    
    const addOption = () => {
      if (!currentElement.value.options) {
        currentElement.value.options = []
      }
      
      const newOptionIndex = currentElement.value.options.length + 1
      currentElement.value.options.push({
        label: `Option ${newOptionIndex}`,
        value: `option${newOptionIndex}`
      })
    }
    
    const removeOption = (index) => {
      currentElement.value.options.splice(index, 1)
    }
    
    const saveElement = () => {
      if (!currentElement.value.label || !currentElement.value.name) {
        ElMessage.warning('Element label and name are required')
        return
      }
      
      if (isEditingElement.value) {
        form.elements[currentElementIndex.value] = { ...currentElement.value }
      } else {
        form.elements.push({ ...currentElement.value })
      }
      
      elementDialogVisible.value = false
      currentElementIndex.value = -1
      currentElement.value = {}
    }
    
    const saveForm = async () => {
      if (!form.name) {
        ElMessage.warning('Form name is required')
        return
      }
      
      try {
        if (isEdit.value) {
          await store.dispatch('updateForm', form)
          ElMessage.success('Form updated successfully')
        } else {
          const newForm = await store.dispatch('createForm', form)
          ElMessage.success('Form created successfully')
          router.push(`/forms/${newForm._id}`)
        }
      } catch (error) {
        ElMessage.error(`Failed to ${isEdit.value ? 'update' : 'create'} form`)
      }
    }
    
    return {
      form,
      loading,
      templatesLoading,
      isEdit,
      templates,
      availableElements,
      elementDialogVisible,
      isEditingElement,
      currentElement,
      onTemplateChange,
      onDragStart,
      onDrop,
      editElement,
      removeElement,
      addOption,
      removeOption,
      saveElement,
      saveForm
    }
  }
}
</script>

<style scoped>
.form-builder {
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.form-settings, .form-canvas {
  height: 100%;
}

.element-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.element-item {
  cursor: move;
}

.form-drop-area {
  min-height: 400px;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.empty-form, .loading-template {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  padding: 2rem 0;
}

.form-element {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f5f7fa;
}

.template-element {
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
}

.element-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.element-actions {
  display: flex;
  gap: 0.5rem;
}

.element-preview {
  background-color: white;
  padding: 0.5rem;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.option-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}
</style>
