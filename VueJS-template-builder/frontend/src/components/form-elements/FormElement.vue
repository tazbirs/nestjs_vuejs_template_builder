<template>
  <div 
    class="form-element-wrapper"
    :class="{ 'is-required': required }"
  >
    <component 
      :is="getElementComponent()"
      v-bind="elementProps"
      v-on="elementEvents"
    />
    <small v-if="helperText" class="helper-text">{{ helperText }}</small>
  </div>
</template>

<script>
export default {
  name: 'FormElement',
  props: {
    type: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    placeholder: String,
    helperText: String,
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Boolean, Array, Object],
      default: null
    },
    options: Array,
    validation: Object,
    style: Object
  },
  
  emits: ['update:value'],
  
  computed: {
    elementProps() {
      const props = {
        placeholder: this.placeholder,
        disabled: this.disabled,
        modelValue: this.value
      }
      
      // Add options for select, radio, checkbox
      if (this.options && ['select', 'radio', 'checkbox'].includes(this.type)) {
        props.options = this.options
      }
      
      return props
    },
    
    elementEvents() {
      return {
        'update:modelValue': (val) => {
          this.$emit('update:value', val)
        }
      }
    }
  },
  
  methods: {
    getElementComponent() {
      // In a real app, you'd return actual Vue components
      // For now we're returning Element Plus components
      switch (this.type) {
        case 'text':
        case 'email':
        case 'password':
          return 'el-input'
        case 'textarea':
          return 'el-input'
        case 'number':
          return 'el-input-number'
        case 'select':
          return 'el-select'
        case 'radio':
          return 'el-radio-group'
        case 'checkbox':
          return 'el-checkbox-group'
        case 'date':
          return 'el-date-picker'
        case 'time':
          return 'el-time-picker'
        case 'file':
          return 'el-upload'
        case 'slider':
          return 'el-slider'
        case 'switch':
          return 'el-switch'
        case 'heading':
          return 'h4'
        case 'divider':
          return 'el-divider'
        default:
          return 'div'
      }
    }
  }
}
</script>

<style scoped>
.form-element-wrapper {
  margin-bottom: 1rem;
}

.is-required label::after {
  content: '*';
  color: #f56c6c;
  margin-left: 4px;
}

.helper-text {
  display: block;
  font-size: 0.8rem;
  color: #909399;
  margin-top: 0.25rem;
}
</style>
