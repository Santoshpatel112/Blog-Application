import React from 'react';
import LeftSidebar from '@/components/dashboard/leftsidebar';
const layout=({childern}:{childern:React.ReactNode})=>{
    return(
        <div>
            <LeftSidebar/>
            {childern}
            
            </div>
    )
}