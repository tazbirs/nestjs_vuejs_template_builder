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
            @dragover="onDragOver($event)"
            @dragleave="onDragLeave($event)"
            @dragenter.prevent
          >
            <div v-if="form.elements && form.elements.length > 0" class="form-elements">
              <draggable 
                v-model="form.elements" 
                :disabled="form.templateId"
                item-key="id"
                handle=".element-drag-handle"
                ghost-class="ghost-element"
                @start="dragStart"
                @end="dragEnd"
              >
                <template #item="{element, index}">
                  <div
                    class="form-element"
                    :class="{ 'template-element': form.templateId }"
                  >
                    <div class="element-header">
                      <div class="element-title">
                        <el-button 
                          v-if="!form.templateId"
                          class="element-drag-handle" 
                          size="small" 
                          icon="el-icon-rank"
                          text
                        >
                          <el-icon><Rank /></el-icon>
                        </el-button>
                        <span>{{ element.label }}</span>
                      </div>
                      <div class="element-actions">
                        <el-button size="small" @click="editElement(index)" :disabled="form.templateId">Edit</el-button>
                        <el-button size="small" type="danger" @click="removeElement(index)" :disabled="form.templateId">Remove</el-button>
                      </div>
                    </div>
                    
                    <div class="element-preview">
                      <!-- Text Input -->
                      <el-input 
                        v-if="element.type === 'text' || element.type === 'email' || element.type === 'password' || element.type === 'mobile'"
                        :type="element.type === 'mobile' ? 'tel' : element.type"
                        :placeholder="element.placeholder || (element.type === 'mobile' ? 'Enter mobile number' : '')"
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
                      
                      <!-- Date Range Picker -->
                      <el-date-picker
                        v-else-if="element.type === 'date-range'"
                        type="daterange"
                        range-separator="To"
                        :start-placeholder="element.startPlaceholder || 'Start date'"
                        :end-placeholder="element.endPlaceholder || 'End date'"
                        value-format="yyyy-MM-dd"
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
                      
                      <!-- Form Header -->
                      <div v-else-if="element.type === 'header'" class="form-header-preview">
                        <h2>{{ element.label || 'Form Header' }}</h2>
                        <div v-if="element.image" class="header-image-placeholder">
                          <el-image :src="element.image" fit="contain" style="height: 60px; max-width: 200px;"></el-image>
                        </div>
                        <div v-else class="header-image-placeholder">
                          <el-icon><Picture /></el-icon>
                          <span>Image placeholder</span>
                        </div>
                      </div>
                      
                      <!-- Image -->
                      <div v-else-if="element.type === 'image'" class="image-preview">
                        <div v-if="element.image" class="image-placeholder">
                          <el-image :src="element.image" fit="contain" style="height: 100px;"></el-image>
                        </div>
                        <div v-else class="image-placeholder">
                          <el-icon><Picture /></el-icon>
                          <span>Image placeholder</span>
                        </div>
                      </div>
                      
                      <!-- Default case -->
                      <div v-else>{{ element.type }} element</div>
                    </div>
                  </div>
                </template>
              </draggable>
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

        <!-- Validation Section for Text Fields -->
        <template v-if="currentElement.type === 'text'">
          <el-divider content-position="left">Text Validation</el-divider>
          <el-form-item label="Min Length">
            <el-input-number v-model="getValidationObj().minLength" :min="0" :step="1" />
          </el-form-item>
          <el-form-item label="Max Length">
            <el-input-number v-model="getValidationObj().maxLength" :min="0" :step="1" />
          </el-form-item>
          <el-form-item label="Regex Pattern">
            <el-input v-model="getValidationObj().pattern" placeholder="e.g. ^[a-zA-Z0-9]+$" />
          </el-form-item>
          <el-form-item label="Pattern Description">
            <el-input v-model="getValidationObj().patternDescription" placeholder="Alphanumeric characters only" />
          </el-form-item>
        </template>

        <!-- Validation Section for Number Fields -->
        <template v-if="currentElement.type === 'number'">
          <el-divider content-position="left">Number Validation</el-divider>
          <el-form-item label="Min Value">
            <el-input-number v-model="getValidationObj().min" :step="1" />
          </el-form-item>
          <el-form-item label="Max Value">
            <el-input-number v-model="getValidationObj().max" :step="1" />
          </el-form-item>
        </template>

        <!-- Mobile Number Validation -->
        <template v-if="currentElement.type === 'mobile'">
          <el-divider content-position="left">Mobile Validation</el-divider>
          <el-form-item label="Format">
            <el-select v-model="getValidationObj().mobileNumberFormat" placeholder="Select format">
              <el-option label="International" value="international" />
              <el-option label="US" value="us" />
              <el-option label="UK" value="uk" />
              <el-option label="Custom" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="getValidationObj().mobileNumberFormat === 'custom'" label="Custom Pattern">
            <el-input v-model="getValidationObj().pattern" placeholder="e.g. ^[0-9]{10}$" />
          </el-form-item>
        </template>

        <!-- Date Field Validation -->
        <template v-if="currentElement.type === 'date'">
          <el-divider content-position="left">Date Validation</el-divider>
          <el-form-item label="Min Date">
            <el-date-picker v-model="getValidationObj().minDate" type="date" placeholder="Select min date" />
          </el-form-item>
          <el-form-item label="Max Date">
            <el-date-picker v-model="getValidationObj().maxDate" type="date" placeholder="Select max date" />
          </el-form-item>
        </template>

        <!-- Date Range Field Settings -->
        <template v-if="currentElement.type === 'date-range'">
          <el-divider content-position="left">Date Range Settings</el-divider>
          <el-form-item label="Min Date">
            <el-date-picker v-model="getValidationObj().minDate" type="date" placeholder="Select min date" />
          </el-form-item>
          <el-form-item label="Max Date">
            <el-date-picker v-model="getValidationObj().maxDate" type="date" placeholder="Select max date" />
          </el-form-item>
          <el-form-item label="Start Placeholder">
            <el-input v-model="currentElement.startPlaceholder" placeholder="Start date" />
          </el-form-item>
          <el-form-item label="End Placeholder">
            <el-input v-model="currentElement.endPlaceholder" placeholder="End date" />
          </el-form-item>
        </template>

        <!-- Image Settings -->
        <template v-if="currentElement.type === 'image' || currentElement.type === 'header'">
          <el-divider content-position="left">Image Settings</el-divider>
          <el-form-item label="Image URL">
            <el-input v-model="currentElement.image" placeholder="https://example.com/image.jpg" />
          </el-form-item>
          <el-form-item v-if="currentElement.image">
            <el-image :src="currentElement.image" style="max-height: 100px;" fit="contain" />
          </el-form-item>
        </template>
        
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
import { Picture, Rank } from '@element-plus/icons-vue'
import { v4 as uuidv4 } from 'uuid'
import draggable from 'vuedraggable'

export default {
  name: 'FormBuilder',
  components: {
    Picture,
    Rank,
    draggable
  },
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
      { type: 'mobile', label: 'Mobile Number' },
      { type: 'select', label: 'Dropdown' },
      { type: 'radio', label: 'Radio Buttons' },
      { type: 'checkbox', label: 'Checkboxes' },
      { type: 'date', label: 'Date Picker' },
      { type: 'date-range', label: 'Date Range Picker' },
      { type: 'time', label: 'Time Picker' },
      { type: 'file', label: 'File Upload' },
      { type: 'slider', label: 'Slider' },
      { type: 'switch', label: 'Switch' },
      { type: 'divider', label: 'Divider' },
      { type: 'heading', label: 'Heading' },
      { type: 'image', label: 'Image' },
      { type: 'header', label: 'Form Header' }
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
      
      // Set data
      event.dataTransfer.setData('element', JSON.stringify(element))
      
      // Set drag image and effects
      event.dataTransfer.effectAllowed = 'copy'
      
      // Create a drag ghost element
      const dragGhost = document.createElement('div')
      dragGhost.classList.add('drag-ghost')
      dragGhost.innerHTML = `<span>${element.label}</span>`
      document.body.appendChild(dragGhost)
      
      // Set as drag image with offset
      event.dataTransfer.setDragImage(dragGhost, 20, 20)
      
      // Clean up ghost element after drag operation
      setTimeout(() => {
        document.body.removeChild(dragGhost)
      }, 0)
    }
    
    const onDragOver = (event) => {
      event.preventDefault()
      event.currentTarget.classList.add('drop-target-active')
    }
    
    const onDragLeave = (event) => {
      event.preventDefault()
      event.currentTarget.classList.remove('drop-target-active')
    }
    
    const onDrop = (event) => {
      if (form.templateId) return // Prevent dropping if using a template
      
      // Remove highlight
      event.currentTarget.classList.remove('drop-target-active')
      
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
    
    // For draggable reordering
    const dragStart = (event) => {
      // Add styling when starting to drag an element
      event.item.classList.add('element-being-dragged')
    }
    
    const dragEnd = (event) => {
      // Remove styling when drag ends
      event.item.classList.remove('element-being-dragged')
      // Update order property of elements if needed 
      form.elements.forEach((element, index) => {
        element.order = index
      })
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
    
    const getValidationObj = () => {
      if (!currentElement.value.validation) {
        currentElement.value.validation = {}
      }
      return currentElement.value.validation
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
        // Make sure all elements have IDs and order properties
        if (form.elements) {
          form.elements.forEach((element, index) => {
            if (!element.id) {
              element.id = uuidv4()
            }
            element.order = index
          })
        }
        
        // Create a clean copy of the form object to avoid reactivity issues
        const formToSave = JSON.parse(JSON.stringify(form))
        
        if (isEdit.value) {
          await store.dispatch('updateForm', formToSave)
          ElMessage.success('Form updated successfully')
        } else {
          const newForm = await store.dispatch('createForm', formToSave)
          ElMessage.success('Form created successfully')
          router.push(`/forms/${newForm._id}`)
        }
      } catch (error) {
        console.error('Form save error:', error)
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
      onDragOver,
      onDragLeave,
      onDrop,
      dragStart,
      dragEnd,
      editElement,
      removeElement,
      addOption,
      removeOption,
      getValidationObj,
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
  transition: all 0.3s ease;
}

.drop-target-active {
  border-color: #409EFF;
  background-color: rgba(64, 158, 255, 0.1);
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
}

.drag-ghost {
  position: fixed;
  top: -1000px;
  left: -1000px;
  background-color: #409EFF;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 9999;
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

.element-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.element-drag-handle {
  cursor: move;
  color: #909399;
}

.element-drag-handle:hover {
  color: #409EFF;
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

.form-header-preview {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 15px;
}

.header-image-placeholder,
.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  min-height: 60px;
  min-width: 200px;
  color: #909399;
}

.image-preview {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.ghost-element {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #409EFF;
}

.element-being-dragged {
  transform: rotate(1deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
