import {Route, Routes} from 'react-router-dom'
import Home from './Views/Home'
import UserList from './Views/User/UserList'
import UserForm from './Views/User/UserForm'
import NotFound from './Views/NotFound'
import UserAdd from './Views/User/UserAdd'
import LoginUser from './Views/User/LoginUser'
import GatewayForm from './Views/Gateway/GatewayForm'
import GatewayList from './Views/Gateway/GatewayList'
import DispositivoForm from './Views/Dispositivo/DispositivoForm'
import DispositivoList from './Views/Dispositivo/DispositivoList'
import DispositivoDetails from './Views/Dispositivo/DispositivoDetails'
import AtuadorForm from './Views/Atuador/AtuadorForm'
import SensorForm from './Views/Sensor/SensorForm'
import LeituraForm from './Views/Leitura/LeituraForm'
import LeituraList from './Views/Leitura/LeituraList'
import HeaderHome from './Views/HeaderHome'
import Header from './Header'
import { useState } from 'react'


const AppRoutes = ({ setIsAuthenticated }) => {

    return(
        <>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                {/* <Route path='/user' element={<UserList/>}></Route>
                <Route path='/user/new' element={<UserForm/>}></Route>
                <Route path='/user/:id' element={<UserForm/>}></Route> */}
                <Route path='*' element={<NotFound/>}></Route>
                <Route path="/user-add" element={<UserAdd/>} />
                <Route path='/user-login' element={<LoginUser setIsAuthenticated={setIsAuthenticated} />} />

                <Route path="/gateway/new" element={<GatewayForm/>} />
                <Route path="/gateway/:id" element={<GatewayForm/>} />
                <Route path="/gateway" element={<GatewayList/>} />

                <Route path="/dispositivo/new" element={<DispositivoForm/>} />
                <Route path="/dispositivo/:id" element={<DispositivoForm/>} />
                <Route path="/dispositivo" element={<DispositivoList/>} /> 
                <Route path="/dispositivo/details/:id" element={<DispositivoDetails/>} /> 

                <Route path="/atuador/new" element={<AtuadorForm/>} />
                <Route path="/atuador/:id" element={<AtuadorForm/>} />

                <Route path="/sensor/new" element={<SensorForm/>} />
                <Route path="/sensor/:id" element={<SensorForm/>} />

                <Route path="/leitura/new" element={<LeituraForm/>} />
                <Route path="/leitura/:id" element={<LeituraForm/>} />
                <Route path="/leitura" element={<LeituraList/>} /> 

            </Routes>
        </>
    )
}

export default AppRoutes