import React from 'react'
import { useState } from 'react'
import { Github } from "lucide-react"
import axios from "axios";
import { environment } from "../environments/environment";
import { useDispatch } from "react-redux";
import { login } from "../lib/authSlice";
import { useNavigate } from "react-router-dom";

export default function Inicio() {
    const [showLogin, setShowLogin] = useState(true)
    const api = axios.create({
        baseURL: environment.backendUrl,
        headers: { "Content-Type": "application/json" },
    });
    const [formData, setFormData] = useState({
        usuario: "",
        correo: "",
        nombre: "",
        apell_paterno: "",
        apell_materno: "",
        contrasena: "",
        tipo_usuario: "cliente",
        contrasenaConfirmada:""

    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita recargar la página
        try {
            const response = await api.post("/api/usuarios/crearusuario", formData, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Usuario creado:", response.data);
            alert("Usuario creado con éxito!");

            // Resetear el formulario
            setFormData({
                usuario: "",
                correo: "",
                nombre: "",
                apell_paterno: "",
                apell_materno: "",
                contrasena: "",
                tipo_usuario: "cliente",
                contrasenaConfirmada:""


            });
            setShowLogin(true)
        } catch (error) {
            console.error("Error al crear el usuario:", error.response?.data || error.message);
            alert("Error al crear el usuario");
        }
    };

    //Login
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const iniciarLogeo = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/api/usuarios/login", {
                correo,
                contrasena,
            });

            dispatch(login(response.data.token)); // Guardar en Redux
            navigate("/dashboard"); // Redirigir al dashboard

        } catch (err) {
            console.error("Error en login", err);
        }
    };


    const validatePasswords = () => {
        if (formData.contrasena.length < 8 || formData.contrasenaConfirmada.length < 8) {
          setError('La contraseña debe tener al menos 8 caracteres');
        } else if (formData.contrasena !== formData.contrasenaConfirmada) {
          setError('Las contraseñas no coinciden');
        } else {
          setError('');
        }
      };

      const isSubmitDisabled = formData.contrasena !== formData.contrasenaConfirmada || formData.contrasena.length < 8 || formData.contrasenaConfirmada.length < 8;
      return (
        <>
            <div className="flex min-h-screen">
                {/* Columna izquierda */}
                <div className="hidden w-1/2 bg-[url('/negro.png')] bg-cover bg-center bg-no-repeat lg:block relative">
                    <div className="flex h-full flex-col items-center justify-center p-12">
                        <div className="text-center flex flex-col gap-10">
                            <img src="/grow_logo.jpeg" alt="Logo" className="mx-auto h-[14rem] w-[14rem] z-2" />
                            <div className="relative z-2">
                                <h1
                                    className="text-5xl font-bold tracking-tight text-start"
                                    style={{
                                        background: "linear-gradient(to bottom, #FFFF00 0%, #FFB800 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        filter: "drop-shadow(0 0 15px rgba(255, 255, 0, 0.5))",
                                    }}
                                >
                                    Bienvenido de vuelta,
                                    <br />
                                    Empezemos!

                                </h1>
                            </div>
                        </div>
                    </div>

                </div>
                {showLogin && (
                    <div className="w-full bg-black p-12 lg:w-1/2 flex items-center">
                        <div className="mx-auto max-w-lg">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-white">Iniciar Sesión</h2>
                                <p className="mt-2 text-gray-400">Ingresa tus credenciales para acceder a tu cuenta.</p>
                            </div>

                            <div className="mt-8 space-y-3">
                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-900 transition duration-200 ease-in-out transform hover:scale-[1.02]">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </button>

                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-900 transition duration-200 ease-in-out transform hover:scale-[1.02]">
                                    <Github className="w-5 h-5" />
                                    GitHub
                                </button>
                            </div>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-black text-gray-400">o</span>
                                </div>
                            </div>

                            <form className="mt-8 space-y-6" onSubmit={iniciarLogeo}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                                        Usuario
                                    </label>
                                    <input
                                        type="text"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        placeholder="ej. juan@gmail.com"
                                        className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={contrasena}
                                        onChange={(e) => setContrasena(e.target.value)}
                                        placeholder="Ingresa tu contraseña"
                                        className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-700 bg-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:ring-offset-black"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                            Recordarme
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-[#FFFF00] hover:text-[#FFFF33]  transition duration-200">
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#FFFF00]
                                     hover:bg-[#FFFF33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFF00] transition duration-200 ease-in-out transform hover:scale-[1.02]"
                                >
                                    Iniciar Sesión
                                </button>
                            </form>

                            <p className="mt-4 text-center text-sm text-gray-400">
                                ¿No tienes una cuenta?{" "}
                                <button className="font-medium text-[#FFFF00] hover:text-[#FFFF33]  transition duration-200"
                                    onClick={() => setShowLogin(false)}>
                                    Regístrate
                                </button>
                            </p>
                        </div>
                    </div>)}
                {!showLogin && (
                    <div className="w-full bg-black p-12 lg:w-1/2 flex items-center">
                        <div className="mx-auto max-w-lg">
                            <h2 className="text-3xl font-bold text-white">Crear Cuenta</h2>
                            <p className="mt-2 text-gray-400">Ingresa tus datos personales para crear tu cuenta.</p>

                            <div className="mt-8 flex gap-4">
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-800 bg-black py-3 text-white hover:bg-gray-900">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </button>
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-800 bg-black py-3 text-white hover:bg-gray-900">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>

                            <div className="relative mt-8 flex items-center">
                                <div className="flex-grow border-t border-gray-800"></div>
                                <span className="mx-4 flex-shrink text-gray-400">o</span>
                                <div className="flex-grow border-t border-gray-800"></div>
                            </div>

                            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm text-gray-400">Nombres</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            required
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="ej. Juan"
                                            className="mt-2 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-[#FFFF00] focus:outline-none"
                                        />
                                    </div>

                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm text-gray-400">Apellido Paterno</label>
                                        <input
                                            type="text"
                                            name="apell_paterno"
                                            required
                                            value={formData.apell_paterno}
                                            onChange={handleChange}
                                            placeholder="ej. Juan"
                                            className="mt-2 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-[#FFFF00] focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm text-gray-400">Apellido Materno</label>
                                        <input
                                            type="text"
                                            name="apell_materno"
                                            required
                                            value={formData.apell_materno}
                                            onChange={handleChange}
                                            placeholder="ej. Pérez"
                                            className="mt-2 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-[#FFFF00] focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        name="correo"
                                        required
                                        value={formData.correo}
                                        onChange={handleChange}
                                        placeholder="ej. juan@gmail.com"
                                        className="mt-2 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-[#FFFF00] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Usuario</label>
                                    <input
                                        type="text"
                                        name="usuario"
                                        required
                                        value={formData.usuario}
                                        onChange={handleChange}
                                        placeholder="ej. juan@gmail.com"
                                        className="mt-2 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-[#FFFF00] focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm text-gray-400">Contraseña</label>
                                        <input
                                            type="password"
                                            name="contrasena"
                                            required
                                            value={formData.contrasena}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu contraseña"
                                            className="mt-2 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-[#FFFF00] focus:outline-none"
                                        />
                                        <p className="mt-2 text-sm text-gray-400">Debe tener al menos 8 caracteres.</p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm text-gray-400">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            required
                                            name="contrasenaConfirmada"
                                            value={formData.contrasenaConfirmada}
                                            onChange={handleChange}
                                            onBlur={validatePasswords}
                                            placeholder="Ingresa tu contraseña"
                                            className="mt-2 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-[#FFFF00] focus:outline-none"
                                        />
                                        <p className="mt-2 text-sm text-gray-400">Debe tener al menos 8 caracteres.</p>
                                    </div>
                                </div>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}


                                <button
                                    className={`w-full rounded-lg py-3 text-black ${isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FFFF00] hover:bg-[#FFFF33]'}`}
                                    disabled={isSubmitDisabled}
                                >
                                    Registrarse
                                </button>

                                <p className="text-center text-sm text-gray-400 flex gap-2 justify-center">
                                    ¿Ya tienes una cuenta?
                                    <button onClick={() => setShowLogin(true)} className="text-[#FFFF00] hover:text-[#FFFF33]">
                                        Inicia sesión
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div>)}





            </div>
        </>
    )
}
