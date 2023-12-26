import Axios from "axios";

Axios.defaults.timeout = 10 * 1000;
Axios.defaults.headers.common.Accept = "application/json";
Axios.defaults.headers.common.ContentType = "application/json";
const $axios = Axios;

const vueAxios = {
    async install(app) {
        // const $auth = useTokenStore();
        // const $loading = useLoadingStore();

        // const vue = app.config.globalProperties;
        // $axios.defaults.baseURL = `${process.env.VUE_APP_API_PROTOCOL}://${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}`;
        // $axios.interceptors.request.use((config) => {
        //     console.log(`Request : ${config.url}, ${JSON.stringify(config.params)}`);
        //     if (config.params !== null && config.params !== undefined) {
        //         if (config.method === "get" && config.params['load_param'] === true) {
        //             $loading.setLoading(true);
        //         }
        //     }
        //     if (config.method !== "get") {
        //         $loading.setLoading(true);
        //     }
        //     let token = $auth.getToken();
        //     if (token) {
        //         config.headers.Authorization = `${token}`;
        //     }
        //     return config;
        // }, (error) => {
        //     $loading.setLoading(false);
        //     return Promise.reject(error);
        // });

        // $axios.interceptors.response.use((response) => {
        //     $loading.setLoading(false);

        //     if (response.data.code > 1) {
        //         //useToast().error(response.data.message);
        //         return Promise.reject(response.data);
        //     }
        //     return response;
        // }, (error) => {
        //     $loading.setLoading(false);
        //     if (error.response) {
        //         switch(error.response.status){
        //             case 403:
        //                 showAlert("인증이 만료되어 로그아웃 됩니다.", () => {
        //                     router.replace({name: "Login"})
        //                 }).open();
        //                 break
        //             case 500:
        //                 router.replace({name: "InternalServer"})
        //                 break;
        //             default:
        //                 useToast().error(error.response.data);
        //                 break;
        //         }
        //     }
        //     return Promise.reject(error);
        // });
        // vue.$axios = $axios;
    }
};

export {$axios, vueAxios};

