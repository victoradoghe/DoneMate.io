import { IonCheckmarkDoneCircleOutline } from './FaviconIcon'

import React from 'react'

 function LoadingScreen () {
    return(
        <div className='loading-container'>
            <div className='loading-screen'>
                <div className='loader'>
                    <h2><IonCheckmarkDoneCircleOutline/> DoneMate</h2>
                <p>Focus. Finish. Repeat.</p>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen