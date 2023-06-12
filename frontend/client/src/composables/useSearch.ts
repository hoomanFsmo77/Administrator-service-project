import {reactive} from "vue";
import {envVariable,useAuthStore} from "./useStates";

export const useSearch=(props:{modelValue:any},emit:any)=>{
    const searchData=reactive({
        searchContent:'' as string,
        searchResultFlag:false as boolean,
        searchResult:[] as any[]
    });
    const {apiBase,apiKey}=envVariable();
    const {token}=useAuthStore();

    const searchHandler = () => {
        emit('update:modelValue',searchData.searchContent.length > 0)
        searchData.searchResultFlag=false
        searchData.searchResult=[]
        if(searchData.searchContent.length>0){
            fetch(apiBase+`/panel/search?username=${searchData.searchContent}`,{
                headers:{
                    Authorization:apiKey,
                    token:token.value,
                    'Content-Type':'application/json'
                }
            }).then(response=>response.json()).then(response=>{
                searchData.searchResultFlag=true
                searchData.searchResult=response
            })
        }
    }

    const closeResult = () => {
        searchData.searchContent=''
        emit('update:modelValue',false)
    }

    return{searchHandler,searchData,closeResult}
}