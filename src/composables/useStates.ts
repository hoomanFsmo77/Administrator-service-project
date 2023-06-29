import {Auth} from '../store/auth'
import {Dashboard} from "../store/dashboard";
import {Table} from "../store/table";
import {computed} from "vue";
import {IUsers_Data,IOnline_Users_Data} from "../utils/Types";

export const envVariable=()=>{
    const apiBase:string|undefined=process.env.API_BASE || 'http://localhost/';
    const cookieName:string|undefined=process.env.COOKIE_NAME || 'fb69cda06c628';
    const appVersion:string|undefined=process.env.VERSION || '0.0.9';


    return{
        apiBase,cookieName,appVersion
    }
}

export const useAuthStore=()=>{
    const authStore=Auth()
    const username=computed<string>(()=>authStore.username)
    const isLogin=computed<boolean>(()=>authStore.isLogin)
    const token=computed<string>(()=>authStore.token)


    return {authStore,username,isLogin,token}
}


export const useDashboardStore=()=>{
    const dashboardStore=Dashboard()
    const sidebarCollapseFlag=computed<boolean>(()=>dashboardStore.sidebarCollapseFlag)
    const showPreloaderFlag=computed<boolean>(()=>dashboardStore.showPreloaderFlag)
    const fetchDashboardDataFlag=computed(()=>dashboardStore.fetchDashboardDataFlag)
    const usersStatusData=computed(()=>dashboardStore.usersStatusData)
    const serverStatus=computed(()=>dashboardStore.serverStatus)
    const getNotificationData=computed(()=>dashboardStore.notificationData)
    const windowWidth:null|number= window.innerWidth

    return{
        sidebarCollapseFlag,windowWidth,dashboardStore,showPreloaderFlag,fetchDashboardDataFlag,usersStatusData,serverStatus,getNotificationData
    }
}

export const useTableStore=()=>{
    const tableStore=Table()
    const tableData=computed<IOnline_Users_Data | IUsers_Data>(()=>tableStore.tableData)
    const fetchTableDataFlag=computed<boolean>(()=>tableStore.fetchTableDataFlag)
    const selectedUserToDelete=computed<string[]>(()=>tableStore.selectedUserToDelete)
    const selectedOnlineUserToKill=computed<string[]>(()=>tableStore.selectedOnlineUserToKill)
    const paginationData=computed<any>(()=>tableStore.paginationData)
    const searchText=computed<string>(()=>tableStore.searchText)


    return{
        tableData,
        fetchTableDataFlag,
        selectedUserToDelete,
        selectedOnlineUserToKill,
        tableStore,paginationData,
        searchText
    }
}