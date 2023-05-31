import {IUsers_Data} from "~/utils/Types";

export const useUserOperation=(props:any)=>{
    const downloadAnchorElem=ref<HTMLAnchorElement|null>(null);
    const dropdownFlag=ref<boolean>(false);
    const showPasswordFlag=ref<boolean>(false);
    const newExpirationDateForm=ref<HTMLFormElement|null>(null)
    const {tableData,fetchTableDataFlag,showPreloaderFlag}=useStates()
    const operationData=reactive({
        name:'',
        modal:false,
        username:'',
        newPassword:'',
        changePassword:false,
        renewUser:false
    })
    const submitNewExpForm = () => {
        if(newExpirationDateForm.value){
            const node = (newExpirationDateForm.value as any).node
            node.submit()
        }
    };

    const editUser = (uid:string|number) => {
        console.log(uid)

    }
    const toggleDropdown = () => {
        dropdownFlag.value=!dropdownFlag.value
    }
    const downloadUserDetail = ()  => {
        if(downloadAnchorElem.value && process.client){
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                username:props.user,
                password:props.passwd,
                phone:props.phone,
                email:props.email,
                expired:props.exdate,
                status:props.status,
                telegram_id:props.telegram_id,
                registered:props.registered,
                traffic:props.traffic,
                limitation:props.multi,
                desc:props.desc,
                referral:props.referral,
            }));
            downloadAnchorElem.value.setAttribute("href",     dataStr     );
            downloadAnchorElem.value.setAttribute("download", `${props.user}.json`);
            downloadAnchorElem.value.click();
        }
    }

    ///// setting operations
    const deleteUser = async () => {
        dropdownFlag.value=false
        showPreloaderFlag.value=true
        fetchTableDataFlag.value=false
        try {
            const deleteUserRequest=await $fetch(`/api/users/delete/${props.user}`,{
                method:'DELETE'
            })
            operationData.modal=false
            const userIndex=tableData.value.rows.findIndex((item:any)=>item.uid===props.uid)
            tableData.value.rows.splice(userIndex,1)
        }catch (err) {
            console.log(err)
        }finally {
            fetchTableDataFlag.value=true
            showPreloaderFlag.value=false
        }
    }
    const changePassword = async () => {
        dropdownFlag.value=false
        operationData.modal=false
        try {
            const changePasswordRequest=await $fetch<{password:string,username:string}>(`/api/users/password/${props.user}`,{
                method:'POST'
            })
            operationData.newPassword=changePasswordRequest.password
            operationData.changePassword=true
            operationData.name='Password'
            operationData.modal=true
            const userIndex=tableData.value.rows.findIndex((item:any)=>item.uid===props.uid);
            (tableData.value as IUsers_Data).rows[userIndex].passwd=changePasswordRequest.password
        }catch (err) {
            console.log(err)
        }

    }
    const lockUser = async () => {
        dropdownFlag.value=false
        try {
            const lockUserRequest=await $fetch(`/api/users/lock/${props.user}`,{
                method:'POST'
            })
            const userIndex=tableData.value.rows.findIndex((item:any)=>item.uid===props.uid);
            (tableData.value as IUsers_Data).rows[userIndex].status='disable';
            operationData.modal=false
        }catch (err) {
            console.log(err)
        }
    }
    const unlockUser =async () => {
        dropdownFlag.value=false
        try {
            const lockUserRequest=await $fetch(`/api/users/unlock/${props.user}`,{
                method:'POST'
            })
            const userIndex=tableData.value.rows.findIndex((item:any)=>item.uid===props.uid);
            (tableData.value as IUsers_Data).rows[userIndex].status='enable';
            operationData.modal=false
        }catch (err) {
            console.log(err)
        }
    }
    const renewUser = async (value:any) => {
        dropdownFlag.value=false
        try {
            const renewUserRequest=await $fetch(`/api/users/renew/${props.user}`,{
                method:'POST',
                body:value.new_exp
            })
            const userIndex=tableData.value.rows.findIndex((item:any)=>item.uid===props.uid);
            (tableData.value as IUsers_Data).rows[userIndex].exdate=value.new_exp;
            operationData.renewUser=false
            operationData.modal=false
        }catch (err) {
            console.log(err)
        }
    }
    /////


    ////// select operation
    const selectOperation = (name:string) => {
        operationData.name=name
        operationData.modal=true
        operationData.username=props.user
        operationData.newPassword=''
        operationData.changePassword=false
        operationData.renewUser = name === 'Renew user';
    }

    const handlers=(name:string)=>{
        if(name==='Delete user'){
            return {
                'click':deleteUser
            }
        }else if(name==='Change password'){
            return {
                'click':changePassword
            }
        }else if(name==='Lock user'){
            return {
                'click':lockUser
            }
        }else if(name==='Unlock user'){
            return {
                'click':unlockUser
            }
        }else if(name==='Renew user'){
            return {
                'click':submitNewExpForm
            }
        }
    }



    return{
        editUser,downloadUserDetail,toggleDropdown,downloadAnchorElem,dropdownFlag,showPasswordFlag,deleteUser,operationData,selectOperation,changePassword,lockUser,unlockUser,handlers,renewUser,newExpirationDateForm
    }
}