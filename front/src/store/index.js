import { createStore } from 'vuex';
import api from '@/api';
import { Notify, Loading } from 'notiflix';

export default createStore({
  state: {
    products: [],
    isLoading: false,
    error: null,
    auth: {
      token: localStorage.getItem('token') || null,
      isAdmin: localStorage.getItem('isAdmin') === 'true' || false
    }
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    REMOVE_PRODUCT(state, id) {
      state.products = state.products.filter(p => p.id !== id);
    },
    SET_LOADING(state, value) {
      state.isLoading = value;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_AUTH(state) {
      state.auth.token = null;
      state.auth.isAdmin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
    }
  },
  actions: {
    async fetchProducts({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const products = await api.getProducts();
        commit('SET_PRODUCTS', products);
        return products;
      } catch (error) {
        commit('SET_ERROR', error);
        Notify.failure('Не удалось загрузить продукты');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addProduct({ commit, dispatch }, productData) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        Loading.circle('Добавление продукта...');
        
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
          if (key !== 'photos') {
            formData.append(key, productData[key]);
          }
        });
        
        if (productData.photos?.length) {
          productData.photos.forEach(photo => {
            formData.append('photos', photo);
          });
        }

        const response = await api.addProduct(formData);
        await dispatch('fetchProducts');
        Notify.success('Продукт успешно добавлен');
        return response;
      } catch (error) {
        commit('SET_ERROR', error);
        const errorMsg = error.response?.data?.message || 'Ошибка при добавлении продукта';
        Notify.failure(errorMsg);
        throw error;
      } finally {
        commit('SET_LOADING', false);
        Loading.remove();
      }
    },

    async deleteProduct({ commit }, id) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        Loading.circle('Удаление...');
        await api.deleteProduct(id);
        commit('REMOVE_PRODUCT', id);
        Notify.success('Продукт успешно удален');
      } catch (error) {
        commit('SET_ERROR', error);
        Notify.failure('Не удалось удалить продукт');
        throw error;
      } finally {
        commit('SET_LOADING', false);
        Loading.remove();
      }
    },

    async logout({ commit }) {
      commit('SET_LOADING', true);
      try {
        Loading.circle('Выход из системы...');
        
        // Здесь можно добавить вызов API для выхода, если требуется
        // await api.logout();
        
        commit('CLEAR_AUTH');
        Notify.success('Вы успешно вышли из системы');
        return true;
      } catch (error) {
        commit('SET_ERROR', error);
        Notify.failure('Ошибка при выходе из системы');
        throw error;
      } finally {
        commit('SET_LOADING', false);
        Loading.remove();
      }
    }
  },
  getters: {
    products: state => state.products,
    isLoading: state => state.isLoading,
    error: state => state.error,
    isAuthenticated: state => !!state.auth.token,
    isAdmin: state => state.auth.isAdmin
  }
});