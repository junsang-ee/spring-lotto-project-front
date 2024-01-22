import { $axios } from "@/plugins/axios-plugin";


/**
 * get
 * @param url
 * @param params
 */
function read(url, params) {
    return $axios.get(url, { params: params });
}

/**
 * post
 * @param url
 * @param params
 * @param body
 *
 */
function write(url, params, body) {
    return $axios.post(url, body, { params: params });
}

/**
 * patch
 * @param url
 * @param params
 * @param body
 */
function update(url, params, body) {
    return $axios.patch(url, body, { params: params });
}
  
/**
 * delete
 * @param url
 * @param params
 * @param body
 */
function remove(url, params, body) {
    return $axios.delete(url, { data: body, params: params });
}

export {
    read, write, update, remove
};


