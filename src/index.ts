declare let document:any;
declare let require:any;
export function uuid(key:string=''){
    if(key){
        let k = cache(key)
        if(k){return k}
    }
    let s: any = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010 
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01 
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    if(key){
        cache(key,uuid)
    }
    return uuid;
}

export const IsBrower=document!==undefined;
export function cache(key: string, value?: any){
    if(IsBrower){
        const store = window.localStorage;
        if(null===value){
            store.removeItem(key)
        }else if(undefined!==value){
            store.setItem(key,JSON.stringify([value]))
        }else{
            try {
                let p :any = store.getItem(key)
                return 'string' == typeof p?JSON.stringify(p)[0]:p
            } catch (error) {
                return ''
            }
        }
    }else{
        // const fs = require('fs')
        //TODO need finished
    }
}
/**
 * 循环遍历
 * @param obj 需要遍历的对象或数据
 * @param cb 回调函数
 */
export function foreach(obj,cb:(v:any,k:string|number)=>void|boolean){
    if('object' == typeof obj){
        let ks = Object.keys(obj)
        for(let i =0;i<ks.length;i++){
            if(false===cb(obj[ks[i]],ks[i])){
                break;
            }
        }
    }else{

    }
}
/**
 * 数组求和，支持设定对象字段
 * @param arr 
 * @param column 
 */
export function array_sum(arr:any,column?:string):Number{
    let m = 0;
    foreach(arr,(v,i)=>{
        try {
            if('string' == typeof column||'number' == typeof column){
                m+=Number(v[column])
            }else{
                m+=Number(v);
            }
        } catch (error) {

        }        
    })
    return m;
}
/**
 * 重新设定对象键为指定字段的值
 * @param arr 需要设定的原始对象
 * @param k 对象中的字段
 * @param r 遇到重复是否组成新的数组
 */
export function array_key_set(arr:Object|Object[],k:string,r:boolean=false){
    let o: any = {};
    foreach(arr, (v: any) => {
        if (r) {
            if (undefined===o[v[k]]) o[v[k]] = [];
            o[v[k]].push(v)
        } else {
            o[v[k]] = v;
        }
    })
    return o;
}

/**
 * 仿造php的array_columns函数
 * @param arr
 * @param column
 * @returns {Array}
 */
export function array_columns(arr: any | Array<any>, column: string, unique = false) {
    let a: any[] = [];
    foreach(arr, (v: any, k) => {
        if (unique) {
            if (a.indexOf(v[column]) == -1) {
                a.push(v[column])
            }
        } else {
            a.push(v[column])
        }
    })
    return a;
}
export function array_keys(obj:any){
    return Object.keys(obj)
}
export default {
    cache,uuid,IsBrower,array_columns,foreach,array_keys,array_key_set,array_sum
}