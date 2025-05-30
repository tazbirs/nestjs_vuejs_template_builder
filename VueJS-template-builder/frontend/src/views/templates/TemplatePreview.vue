<template>
  <div class="template-preview">
    <div class="page-header">
      <h1>Template Preview: {{ template?.name }}</h1>
      <div class="header-actions">
        <el-button @click="$router.push('/templates')">Back to Templates</el-button>
        <el-button type="primary" @click="$router.push(`/templates/${id}`)">Edit Template</el-button>
        <el-button type="success" @click="createFormFromTemplate">Create Form</el-button>
      </div>
    </div>
    
    <el-card class="container preview-container">
      <template v-if="loading">
        <div class="loading-state">
          <el-skeleton :rows="6" animated />
        </div>
      </template>
      
      <template v-else-if="template">
        <div class="template-info">
          <h2>{{ template.name }}</h2>
          <p v-if="template.description">{{ template.description }}</p>
          <el-tag :type="template.isPublished ? 'success' : 'info'">
            {{ template.isPublished ? 'Published' : 'Draft' }}
          </el-tag>
        </div>
        
        <el-divider />
        
        <div class="form-preview">
          <h3>Form Elements</h3>
          
          <template v-if="template.elements && template.elements.length > 0">
            <div v-for="(element, index) in template.elements" :key="index" class="preview-element">
              <div class="element-label">
                <label>
                  {{ element.label }}
                  <span v-if="element.required" class="required-marker">*</span>
                </label>
                <small v-if="element.helperText" class="helper-text">{{ element.helperText }}</small>
              </div>
              
              <div class="element-control">
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
          </template>
          
          <div v-else class="empty-preview">
            <el-empty description="This template has no elements yet" />
          </div>
        </div>
      </template>
      
      <template v-else>
        <el-empty description="Template not found" />
      </template>
    </el-card>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'TemplatePreview',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  
  setup(props) {
    const store = useStore()
    const router = useRouter()
    
    const loading = computed(() => store.getters.isLoading)
    const template = computed(() => store.getters.currentTemplate)
    
    onMounted(async () => {
      try {
        await store.dispatch('fetchTemplateById', props.id)
      } catch (error) {
        ElMessage.error('Failed to load template')
      }
    })
    
    const createFormFromTemplate = () => {
      // In a real app, this would create a new form based on the template
      // For now, we just navigate to the form creation page
      router.push({
        path: '/forms/new',
        query: { templateId: props.id }
      })
    }
    
    return {
      loading,
      template,
      createFormFromTemplate
    }
  }
}
</script>

<style scoped>
.template-preview {
  max-width: 1200px;
  margin: 0 auto;
}

.preview-container {
  padding: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.template-info {
  margin-bottom: 2rem;
}

.preview-element {
  margin-bottom: 1.5rem;
}

.element-label {
  margin-bottom: 0.5rem;
}

.element-label label {
  font-weight: bold;
  font-size: 0.9rem;
}

.required-marker {
  color: #f56c6c;
  margin-left: 4px;
}

.helper-text {
  display: block;
  font-size: 0.8rem;
  color: #909399;
  margin-top: 0.25rem;
}

.loading-state {
  padding: 2rem 0;
}

.empty-preview {
  padding: 2rem 0;
}
</style>
