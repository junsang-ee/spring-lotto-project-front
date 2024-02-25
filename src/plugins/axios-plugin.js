import Axios from "axios";
import { useTokenStore } from "@/store/auth";
import { useLoadingStore } from "@/store/loading";
import router from "@/router/router";

Axios.defaults.timeout = 10 * 1000;
Axios.defaults.headers.common.Accept = "application/json";
Axios.defaults.headers.common.ContentType = "application/json";

const $axios = Axios;

const vueAxios = {
  async install(app) {
    const $auth = useTokenStore();
    const $loading = useLoadingStore();
    $axios.defaults.baseURL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`
    if (import.meta.env.VITE_USER_NODE_ENV === "prod") {
      $axios.defaults.baseURL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}`
    }
    const vue = app.config.globalProperties;

    $axios.interceptors.request.use(
      (config) => {
        if (config.method !== "get") {
          $loading.setLoading(true);
        }
        let token = $auth.getToken();
        if (token) {
          config.headers.Authorization = `${token}`;
        }
        return config;
      },
      (error) => {
        $loading.setLoading(false);
        return Promise.reject(error);
      }
    );

    $axios.interceptors.response.use(
      (response) => {
        $loading.setLoading(false);
        let responseCode = response.data.code;
        if (responseCode > 1) {
          return Promise.reject(response.data);
        }
        return response;
      },
      (error) => {
        $loading.setLoading(false);
        if (error.response) {
          switch (error.response.status) {
            case 403:
              alert("세션이 만료되었습니다.");
              router.replace({ name: "Login" });
              break;
            case 500:
              alert("데이터 처리 중 문제가 발생하였습니다.");
              router.back();
              break;
            default:
              break;
          }
        }
        return Promise.reject(error);
      }
    );

    vue.$axios = $axios;
  },
};

export { $axios, vueAxios };
