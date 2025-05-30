<template>
  <div class="form-view">
    <div class="page-header">
      <h1>Form: {{ form?.name }}</h1>
      <div class="header-actions">
        <el-button @click="$router.push('/forms')">Back to Forms</el-button>
        <el-button type="primary" @click="$router.push(`/forms/${id}`)">Edit Form</el-button>
        <el-button type="success" @click="submitForm" v-if="!readonly">Submit</el-button>
      </div>
    </div>
    
    <el-card class="container form-container">
      <template v-if="loading">
        <div class="loading-state">
          <el-skeleton :rows="6" animated />
        </div>
      </template>
      
      <template v-else-if="form">
        <div class="form-info">
          <h2>{{ form.name }}</h2>
          <p v-if="form.description">{{ form.description }}</p>
        </div>
        
        <el-divider />
        
        <el-form 
          ref="formRef"
          :model="formValues"
          label-position="top"
          :disabled="readonly"
        >
          <template v-if="form.elements && form.elements.length > 0">
            <div v-for="(element, index) in form.elements" :key="element.id || index" class="form-item-wrapper">
              <el-form-item 
                :label="element.label"
                :prop="element.name"
                :required="element.required"
              >
                <!-- Helper Text -->
                <template #label v-if="element.helperText">
                  <div>
                    {{ element.label }}
                    <el-tooltip :content="element.helperText" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                
                <!-- Text Input -->
                <el-input 
                  v-if="element.type === 'text'"
                  v-model="formValues[element.name]"
                  :placeholder="element.placeholder"
                />
                
                <!-- Email Input -->
                <el-input 
                  v-else-if="element.type === 'email'"
                  v-model="formValues[element.name]"
                  :placeholder="element.placeholder"
                  type="email"
                />
                
                <!-- Password Input -->
                <el-input 
                  v-else-if="element.type === 'password'"
                  v-model="formValues[element.name]"
                  :placeholder="element.placeholder"
                  type="password"
                  show-password
                />
                
                <!-- Textarea -->
                <el-input 
                  v-else-if="element.type === 'textarea'"
                  v-model="formValues[element.name]"
                  type="textarea"
                  :rows="3"
                  :placeholder="element.placeholder"
                />
                
                <!-- Number Input -->
                <el-input-number 
                  v-else-if="element.type === 'number'"
                  v-model="formValues[element.name]"
                  controls-position="right"
                  style="width: 100%"
                />
                
                <!-- Select -->
                <el-select
                  v-else-if="element.type === 'select'"
                  v-model="formValues[element.name]"
                  :placeholder="element.placeholder"
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
                <el-radio-group v-else-if="element.type === 'radio'" v-model="formValues[element.name]">
                  <el-radio
                    v-for="option in element.options"
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-radio>
                </el-radio-group>
                
                <!-- Checkboxes -->
                <el-checkbox-group v-else-if="element.type === 'checkbox'" v-model="formValues[element.name]">
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
                  v-model="formValues[element.name]"
                  type="date"
                  :placeholder="element.placeholder || 'Select date'"
                  style="width: 100%"
                />
                
                <!-- Time Picker -->
                <el-time-picker
                  v-else-if="element.type === 'time'"
                  v-model="formValues[element.name]"
                  :placeholder="element.placeholder || 'Select time'"
                  style="width: 100%"
                />
                
                <!-- File Upload -->
                <el-upload
                  v-else-if="element.type === 'file'"
                  action="#"
                  :auto-upload="false"
                  v-model:file-list="formValues[element.name]"
                >
                  <el-button type="primary">Click to upload</el-button>
                </el-upload>
                
                <!-- Slider -->
                <el-slider v-else-if="element.type === 'slider'" v-model="formValues[element.name]" />
                
                <!-- Switch -->
                <el-switch v-else-if="element.type === 'switch'" v-model="formValues[element.name]" />
                
                <!-- Heading -->
                <h4 v-else-if="element.type === 'heading'">{{ element.label }}</h4>
                
                <!-- Divider -->
                <el-divider v-else-if="element.type === 'divider'" />
                
                <!-- Default case -->
                <div v-else>{{ element.type }} element</div>
              </el-form-item>
            </div>
          </template>
          
          <div v-else class="empty-form">
            <el-empty description="This form has no elements" />
          </div>
          
          <div class="form-actions" v-if="form.elements?.length && !readonly">
            <el-button type="primary" @click="submitForm">Submit Form</el-button>
            <el-button @click="resetForm">Reset</el-button>
          </div>
        </el-form>
      </template>
      
      <template v-else>
        <el-empty description="Form not found" />
      </template>
    </el-card>
    
    <el-dialog
      v-model="submissionDialogVisible"
      title="Form Submitted"
      width="50%"
    >
      <h3>Form Values:</h3>
      <pre>{{ JSON.stringify(formValues, null, 2) }}</pre>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="submissionDialogVisible = false">Close</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
// Removed unused router import
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

export default {
  name: 'FormView',
  components: {
    QuestionFilled
  },
  props: {
    id: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props) {
    const store = useStore()
    // Removed unused router variable
    const formRef = ref(null)
    
    const loading = computed(() => store.getters.isLoading)
    const form = computed(() => store.getters.currentForm)
    
    const formValues = reactive({})
    const submissionDialogVisible = ref(false)
    
    // Define the function before using it in the watch callback
    const getDefaultValueForType = (type) => {
      switch (type) {
        case 'checkbox': return []
        case 'number': return 0
        case 'switch': return false
        case 'slider': return 0
        case 'file': return []
        default: return ''
      }
    }
    
    onMounted(async () => {
      try {
        await store.dispatch('fetchFormById', props.id)
      } catch (error) {
        ElMessage.error('Failed to load form')
      }
    })
    
    // Initialize form values whenever form changes
    watch(form, (newForm) => {
      if (newForm && newForm.elements) {
        newForm.elements.forEach(element => {
          if (element.type !== 'divider' && element.type !== 'heading') {
            formValues[element.name] = element.defaultValue || getDefaultValueForType(element.type)
          }
        })
      }
    }, { immediate: true })
    
    const submitForm = () => {
      if (formRef.value) {
        formRef.value.validate((valid) => {
          if (valid) {
            // In a real app, you'd send this data to the backend
            ElMessage.success('Form submitted successfully')
            submissionDialogVisible.value = true
          } else {
            ElMessage.error('Please complete all required fields')
            return false
          }
        })
      }
    }
    
    const resetForm = () => {
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }
    
    return {
      loading,
      form,
      formRef,
      formValues,
      submitForm,
      resetForm,
      submissionDialogVisible
    }
  }
}
</script>

<style scoped>
.form-view {
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.form-container {
  padding: 2rem;
}

.form-info {
  margin-bottom: 1.5rem;
}

.form-item-wrapper {
  margin-bottom: 1.5rem;
}

.loading-state {
  padding: 2rem 0;
}

.empty-form {
  padding: 2rem 0;
  text-align: center;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
