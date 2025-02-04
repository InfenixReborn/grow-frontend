import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { useDispatch } from "react-redux";
import { logout } from "../lib/authSlice";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (

    <>
      <div className='p-10'>
        <div className='flex gap-4 '>

          {/* Envolvemos el Card con un Link */}
          <Link to="/dashboard/modelo1">
            <Card
              hoverable
              style={{
                width: 240,
              }}
              cover={<img alt="example" src="https://images.pexels.com/photos/3862605/pexels-photo-3862605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />}
            >
              <Meta title="Modelo 1" description="Solicitud de la prueba N°1" />
            </Card>
          </Link>

          {/* Envolvemos el Card con un Link */}
          <Link to="/dashboard/modelo2">
            <Card
              hoverable
              style={{
                width: 240,
              }}
              cover={<img alt="example" src="https://images.pexels.com/photos/3862149/pexels-photo-3862149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />}
            >
              <Meta title="Modelo 2" description="Solicitud de la prueba N°2" />
            </Card>
          </Link>

          <Card
            onClick={handleLogout}
            hoverable
            style={{
              width: 240,
            }}
            cover={<img alt="example" src="https://images.pexels.com/photos/8106235/pexels-photo-8106235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />}
          >
            <Meta title="Cerrar sesion" description="Cerrar la sesion eliminando el token de redux" />
          </Card>
        </div>
      </div>
    </>
  )
};
export default Dashboard;