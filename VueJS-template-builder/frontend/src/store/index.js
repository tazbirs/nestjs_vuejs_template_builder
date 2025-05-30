import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default createStore({
  state: {
    templates: [],
    currentTemplate: null,
    forms: [],
    currentForm: null,
    loading: false,
    error: null
  },
  getters: {
    templates: state => state.templates,
    currentTemplate: state => state.currentTemplate,
    forms: state => state.forms,
    currentForm: state => state.currentForm,
    isLoading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    SET_TEMPLATES(state, templates) {
      state.templates = templates
    },
    SET_CURRENT_TEMPLATE(state, template) {
      state.currentTemplate = template
    },
    ADD_TEMPLATE(state, template) {
      state.templates.push(template)
    },
    UPDATE_TEMPLATE(state, updatedTemplate) {
      const index = state.templates.findIndex(t => t._id === updatedTemplate._id)
      if (index !== -1) {
        state.templates.splice(index, 1, updatedTemplate)
      }
    },
    REMOVE_TEMPLATE(state, templateId) {
      state.templates = state.templates.filter(t => t._id !== templateId)
    },
    SET_FORMS(state, forms) {
      state.forms = forms
    },
    SET_CURRENT_FORM(state, form) {
      state.currentForm = form
    },
    ADD_FORM(state, form) {
      state.forms.push(form)
    },
    UPDATE_FORM(state, updatedForm) {
      const index = state.forms.findIndex(f => f._id === updatedForm._id)
      if (index !== -1) {
        state.forms.splice(index, 1, updatedForm)
      }
    },
    REMOVE_FORM(state, formId) {
      state.forms = state.forms.filter(f => f._id !== formId)
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    // Template actions
    async fetchTemplates({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${API_URL}/templates`)
        commit('SET_TEMPLATES', response.data)
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch templates')
        console.error('Error fetching templates:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchTemplateById({ commit }, templateId) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${API_URL}/templates/${templateId}`)
        commit('SET_CURRENT_TEMPLATE', response.data)
        commit('SET_ERROR', null)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch template')
        console.error('Error fetching template:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createTemplate({ commit }, template) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.post(`${API_URL}/templates`, template)
        commit('ADD_TEMPLATE', response.data)
        commit('SET_ERROR', null)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to create template')
        console.error('Error creating template:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async updateTemplate({ commit }, template) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.put(`${API_URL}/templates/${template._id}`, template)
        commit('UPDATE_TEMPLATE', response.data)
        commit('SET_ERROR', null)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update template')
        console.error('Error updating template:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async deleteTemplate({ commit }, templateId) {
      commit('SET_LOADING', true)
      try {
        await axios.delete(`${API_URL}/templates/${templateId}`)
        commit('REMOVE_TEMPLATE', templateId)
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to delete template')
        console.error('Error deleting template:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // Form actions
    async fetchForms({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${API_URL}/forms`)
        commit('SET_FORMS', response.data)
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch forms')
        console.error('Error fetching forms:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchFormById({ commit }, formId) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${API_URL}/forms/${formId}`)
        commit('SET_CURRENT_FORM', response.data)
        commit('SET_ERROR', null)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch form')
        console.error('Error fetching form:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createForm({ commit }, form) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.post(`${API_URL}/forms`, form)
        commit('ADD_FORM', response.data)
        commit('SET_ERROR', null)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to create form')
        console.error('Error creating form:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async updateForm({ commit }, form) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.put(`${API_URL}/forms/${form._id}`, form)
        commit('UPDATE_FORM', response.data)
        commit('SET_ERROR', null)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update form')
        console.error('Error updating form:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async deleteForm({ commit }, formId) {
      commit('SET_LOADING', true)
      try {
        await axios.delete(`${API_URL}/forms/${formId}`)
        commit('REMOVE_FORM', formId)
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to delete form')
        console.error('Error deleting form:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchFormsByTemplateId({ commit }, templateId) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${API_URL}/forms/template/${templateId}`)
        commit('SET_FORMS', response.data)
        commit('SET_ERROR', null)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch forms by template')
        console.error('Error fetching forms by template:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
})
