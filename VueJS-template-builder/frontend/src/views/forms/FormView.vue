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
                  :min="element.validation?.min"
                  :max="element.validation?.max"
                />
                
                <!-- Mobile Number Input -->
                <el-input 
                  v-else-if="element.type === 'mobile'"
                  v-model="formValues[element.name]"
                  :placeholder="element.placeholder || 'Enter mobile number'"
                  type="tel"
                  :maxlength="element.validation?.maxLength"
                  :minlength="element.validation?.minLength"
                  :validator="getMobileValidator(element)"
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
                  :disabled-date="getDateValidator(element)"
                />
                
                <!-- Date Range Picker -->
                <el-date-picker
                  v-else-if="element.type === 'date-range'"
                  v-model="formValues[element.name]"
                  type="daterange"
                  range-separator="To"
                  :start-placeholder="element.startPlaceholder || 'Start date'"
                  :end-placeholder="element.endPlaceholder || 'End date'"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :disabled-date="getDateValidator(element)"
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
                
                <!-- Form Header -->
                <div v-else-if="element.type === 'header'" class="form-header-view">
                  <h2>{{ element.label || 'Form Header' }}</h2>
                  <div v-if="element.image" class="header-image">
                    <el-image :src="element.image" fit="contain" style="height: 60px; max-width: 200px;"></el-image>
                  </div>
                </div>
                
                <!-- Image -->
                <div v-else-if="element.type === 'image'" class="form-image-view">
                  <el-image v-if="element.image" :src="element.image" fit="contain" style="max-width: 100%;"></el-image>
                  <div v-else class="image-placeholder">Image placeholder</div>
                </div>
                
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
        case 'date-range': return null // Default value for date range should be null
        default: return ''
      }
    }
    
    // Date validation function
    const getDateValidator = (element) => {
      return (date) => {
        if (!element.validation) return false
        
        const minDate = element.validation.minDate ? new Date(element.validation.minDate) : null
        const maxDate = element.validation.maxDate ? new Date(element.validation.maxDate) : null
        
        if (minDate && date < minDate) return true
        if (maxDate && date > maxDate) return true
        
        return false
      }
    }
    
    // Mobile number validation function
    const getMobileValidator = (element) => {
      return (rule, value, callback) => {
        if (!element.validation || !value) {
          callback()
          return
        }
        
        let pattern
        switch (element.validation.mobileNumberFormat) {
          case 'international':
            pattern = /^\+[1-9]\d{1,14}$/
            break
          case 'us':
            pattern = /^(\+?1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
            break
          case 'uk':
            pattern = /^(\+?44|0)[-.\s]?\d{2,4}[-.\s]?\d{3}[-.\s]?\d{3,4}$/
            break
          case 'custom':
            if (element.validation.pattern) {
              try {
                pattern = new RegExp(element.validation.pattern)
              } catch (e) {
                callback(new Error('Invalid custom pattern'))
                return
              }
            }
            break
          default:
            // Simple default pattern
            pattern = /^\d{7,15}$/
        }
        
        if (pattern && !pattern.test(value)) {
          const errorMessage = element.validation.patternDescription || 'Invalid mobile number format'
          callback(new Error(errorMessage))
        } else {
          callback()
        }
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
          if (element.type !== 'divider' && element.type !== 'heading' && element.type !== 'header' && element.type !== 'image') {
            if (element.type === 'date-range') {
              // For date range, we need special handling
              formValues[element.name] = element.defaultValue || null
            } else {
              formValues[element.name] = element.defaultValue || getDefaultValueForType(element.type)
            }
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
      submissionDialogVisible,
      getDateValidator,
      getMobileValidator
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

.form-header-view {
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.header-image {
  text-align: center;
}

.image-view {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.image-placeholder {
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.form-image-view {
  margin: 10px 0;
  text-align: center;
}

.form-image-view .image-placeholder {
  width: 100%;
  height: auto;
  padding: 10px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #909399;
  text-align: center;
}
</style>
