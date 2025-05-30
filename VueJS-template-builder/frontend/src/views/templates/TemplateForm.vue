<template>
  <div class="template-form">
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit Template' : 'Create Template' }}</h1>
      <div class="header-actions">
        <el-button @click="$router.push('/templates')">Cancel</el-button>
        <el-button type="primary" @click="saveTemplate" :loading="loading">
          Save Template
        </el-button>
      </div>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="container form-settings">
          <h2>Template Settings</h2>
          
          <el-form label-position="top">
            <el-form-item label="Template Name" required>
              <el-input v-model="template.name" placeholder="Enter template name" />
            </el-form-item>
            
            <el-form-item label="Description">
              <el-input
                v-model="template.description"
                type="textarea"
                rows="3"
                placeholder="Enter template description"
              />
            </el-form-item>
            
            <el-form-item>
              <el-switch
                v-model="template.isPublished"
                active-text="Published"
                inactive-text="Draft"
              />
            </el-form-item>
          </el-form>
          
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
            <template v-if="template.elements && template.elements.length > 0">
              <draggable 
                v-model="template.elements" 
                item-key="id" 
                handle=".element-drag-handle"
                ghost-class="ghost-element"
                @start="dragStart"
                @end="dragEnd"
              >
                <template #item="{element, index}">
                  <div class="form-element">
                    <div class="element-header">
                      <div class="element-title">
                        <el-button 
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
                        <el-button size="small" @click="editElement(index)">Edit</el-button>
                        <el-button size="small" type="danger" @click="removeElement(index)">Remove</el-button>
                      </div>
                    </div>
                    
                    <div class="element-preview">
                      <component 
                        :is="getElementComponent()"
                        v-bind="element"
                        disabled
                      />
                    </div>
                  </div>
                </template>
              </draggable>
            </template>
            
            <div v-else class="empty-form">
              <el-empty description="Drag elements here to build your form template" />
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { Rank } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'

export default {
  name: 'TemplateForm',
  components: {
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
    // Removed unused route variable
    
    const template = reactive({
      name: '',
      description: '',
      elements: [],
      isPublished: false
    })
    
    const loading = computed(() => store.getters.isLoading)
    const isEdit = computed(() => !!props.id)
    
    const elementDialogVisible = ref(false)
    const isEditingElement = ref(false)
    const currentElement = ref({})
    const currentElementIndex = ref(-1)
    
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
      if (props.id) {
        try {
          const fetchedTemplate = await store.dispatch('fetchTemplateById', props.id)
          if (fetchedTemplate) {
            Object.assign(template, fetchedTemplate)
          }
        } catch (error) {
          ElMessage.error('Failed to load template')
        }
      }
    })
    
    const onDragStart = (event, element) => {
      event.dataTransfer.setData('element', JSON.stringify(element))
    }
    
    const onDrop = (event) => {
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
      template.elements.forEach((element, index) => {
        element.order = index
      })
    }
    
    const editElement = (index) => {
      currentElement.value = { ...template.elements[index] }
      currentElementIndex.value = index
      isEditingElement.value = true
      elementDialogVisible.value = true
    }
    
    const removeElement = (index) => {
      template.elements.splice(index, 1)
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
        template.elements[currentElementIndex.value] = { ...currentElement.value }
      } else {
        template.elements.push({ ...currentElement.value })
      }
      
      elementDialogVisible.value = false
      currentElementIndex.value = -1
      currentElement.value = {}
    }
    
    const saveTemplate = async () => {
      if (!template.name) {
        ElMessage.warning('Template name is required')
        return
      }
      
      try {
        // Make sure all elements have IDs and order properties
        template.elements.forEach((element, index) => {
          if (!element.id) {
            element.id = uuidv4()
          }
          element.order = index
          
          // Clean up the validation object to remove undefined properties
          if (element.validation) {
            Object.keys(element.validation).forEach(key => {
              if (element.validation[key] === undefined) {
                delete element.validation[key];
              }
            });
          }
          
          // Ensure date objects are properly formatted as strings
          if (element.validation && element.validation.minDate && element.validation.minDate instanceof Date) {
            element.validation.minDate = element.validation.minDate.toISOString().split('T')[0];
          }
          if (element.validation && element.validation.maxDate && element.validation.maxDate instanceof Date) {
            element.validation.maxDate = element.validation.maxDate.toISOString().split('T')[0];
          }
          
          // Make sure options are properly formatted
          if (element.options) {
            element.options = element.options.map(option => ({
              label: option.label || '',
              value: option.value || ''
            }));
          }
        });
        
        // Create a clean copy to avoid reactivity issues
        const templateToSave = JSON.parse(JSON.stringify(template));
        
        // Remove extra Mongoose properties that might cause issues
        if (isEdit.value && templateToSave._id) {
          delete templateToSave.__v;
          delete templateToSave.createdAt;
          delete templateToSave.updatedAt;
          
          // Debug what we're sending to the server
          console.log('Updating template:', templateToSave);
          
          await store.dispatch('updateTemplate', templateToSave);
          ElMessage.success('Template updated successfully');
        } else {
          console.log('Creating template:', templateToSave);
          const newTemplate = await store.dispatch('createTemplate', templateToSave);
          ElMessage.success('Template created successfully');
          router.push(`/templates/${newTemplate._id}`);
        }
      } catch (error) {
        console.error('Template save error:', error);
        if (error.response && error.response.data) {
          console.error('Server error details:', error.response.data);
          ElMessage.error(`Failed to ${isEdit.value ? 'update' : 'create'} template: ${error.response.data.message || error.message}`);
        } else {
          ElMessage.error(`Failed to ${isEdit.value ? 'update' : 'create'} template: ${error.message}`);
        }
      }
    }
    
    const getElementComponent = () => {
      // This would map the element type to a component
      // For now, we'll return a simple string but in a real app, you'd return components
      return 'div'
    }
    
    return {
      template,
      loading,
      isEdit,
      availableElements,
      elementDialogVisible,
      isEditingElement,
      currentElement,
      onDragStart,
      onDrop,
      dragStart,
      dragEnd,
      editElement,
      removeElement,
      addOption,
      removeOption,
      saveElement,
      saveTemplate,
      getElementComponent
    }
  }
}
</script>

<style scoped>
.template-form {
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

.empty-form {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.form-element {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f5f7fa;
  transition: all 0.2s ease;
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

.ghost-element {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #409EFF;
}

.element-being-dragged {
  transform: rotate(1deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
