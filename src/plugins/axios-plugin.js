import Axios from "axios";
import { useTokenStore } from "@/store/auth";
import { useLoadingStore } from "@/store/loading";

Axios.defaults.timeout = 10 * 1000;
Axios.defaults.headers.common.Accept = "application/json";
Axios.defaults.headers.common.ContentType = "application/json";

const $axios = Axios;

const vueAxios = {
    async install(app) {
      const $auth = useTokenStore(); 
      const $loading = useLoadingStore();

      $axios.defaults.baseURL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;

      const vue = app.config.globalProperties;

      $axios.interceptors.request.use((config) => {
          console.log(`Request : ${config.url}, ${JSON.stringify(config.params)}`);
          if (config.method !== "get") {
            $loading.setLoading(true);
          }
          let token = $auth.getToken();
          if (token) {
            config.headers.Authorization = `${token}`;
          }
          return config;
        }, (error) => {
          $loading.setLoading(false);
          return Promise.reject(error);
        });

        $axios.interceptors.response.use((response) => {
          $loading.setLoading(false);
          let responseCode = response.data.code;
          if (responseCode > 1) {
            return Promise.reject(response.data);
          }
          return response;
        }, (error) => {
          $loading.setLoading(false);
          if (error.response) {
          }
          return Promise.reject(error);
        });

      vue.$axios = $axios;
    }
};

export {$axios, vueAxios};

