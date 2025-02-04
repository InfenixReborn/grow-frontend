import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Modal, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import axios from "axios";
import { environment } from "../environments/environment";


const Modelo1 = () => {
    const api = axios.create({
        baseURL: environment.backendUrl,
        headers: { "Content-Type": "application/json" },
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            if (Array.isArray(dataIndex)) {
                return dataIndex.some((key) =>
                    record[key]?.toString().toLowerCase().includes(value.toLowerCase())
                );
            }
            return record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase());
        },
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '30%',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Usuario',
            dataIndex: 'usuario',
            key: 'usuario',
            width: '20%',
            ...getColumnSearchProps('usuario'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            key: 'correo',
            ...getColumnSearchProps('correo'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Nombre Completo',
            dataIndex: 'nombre_completo',
            key: 'nombre_completo',
            ...getColumnSearchProps(['nombre', 'apell_paterno', 'apell_materno']),
            render: (_, record) => `${record.nombre} ${record.apell_paterno} ${record.apell_materno}`,
            sorter: (a, b) => (a.nombre + a.apell_paterno + a.apell_materno).localeCompare(b.nombre + b.apell_paterno + b.apell_materno),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditFilled onClick={() => showModalEdit(record.id)} />
                    <DeleteFilled onClick={() => openNotification(record.id)} />
                </Space>
            ),
        },
    ];
    const [dataUsuarios, setDataUsuarios] = useState([]);
    const [filteredDataUsuarios, setFilteredDataUsuarios] = useState([]);  // Datos filtrados

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/usuarios/listarusuarios", {

                });
                setDataUsuarios(response.data);  // Establecer los datos originales
                setFilteredDataUsuarios(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    //Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const showModalEdit = (usuarioId) => {
        setSelectedUserId(usuarioId);

        const user = dataUsuarios.find((user) => user.id === usuarioId); // Suponiendo que tienes la lista de usuarios en 'usuarios'
        setFormData({
            nombre: user.nombre,
            apell_paterno: user.apell_paterno,
            apell_materno: user.apell_materno,
            correo: user.correo,
            usuario: user.usuario,
            contrasena: "",
            tipo_usuario: user.tipo_usuario
        });
        setIsModalOpenEdit(true);
    };
    const handleOkEdit = () => {
        setIsModalOpenEdit(false);
    };
    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
    };

    const [formData, setFormData] = useState({
        usuario: "",
        correo: "",
        nombre: "",
        apell_paterno: "",
        apell_materno: "",
        contrasena: "",
        tipo_usuario: ""

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const [holder, contextHolder] = notification.useNotification();
    const close = () => {
        console.log(
            'Notification was closed. Either the close button was clicked or duration time elapsed.',
        );
    };
    const eliminarUsuario = async (id) => {
        try {
            await api.delete(`/api/usuarios/eliminarusuario/${id}`);
            setDataUsuarios((prevData) => {
                const newData = prevData.filter(usuario => usuario.id !== id);
                setFilteredDataUsuarios(newData); // Actualizar filteredDataUsuarios también
                return newData;
            });
            holder.destroy()
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };
    const crearUsuario = async (e) => {
        e.preventDefault(); // Evita recargar la página
        try {
            const response = await api.post("/api/usuarios/crearusuario", formData, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Usuario creado:", response.data);
            alert("Usuario creado con éxito!");

            setDataUsuarios((prevUsuarios) => {
                const updatedUsuarios = [...prevUsuarios, response.data];
                setFilteredDataUsuarios(updatedUsuarios); // Actualizar filteredDataUsuarios también
                return updatedUsuarios;
            });
            // Resetear el formulario
            setFormData({
                usuario: "",
                correo: "",
                nombre: "",
                apell_paterno: "",
                apell_materno: "",
                contrasena: "",
                tipo_usuario: ""

            });
            setIsModalOpen(false); // Cerrar el modal

        } catch (error) {
            console.error("Error al crear el usuario:", error.response?.data || error.message);
            alert("Error al crear el usuario");
        }

    };
    const editarUsuario = async (e) => {
        e.preventDefault(); // Evita recargar la página

        try {


            const response = await api.put(`/api/usuarios/editarusuario/${selectedUserId}`, formData, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Usuario actualizado:", response.data);
            if (response.status === 200) {
                // Actualizar la tabla localmente
                setDataUsuarios((prevData) => {
                    const updatedUsuarios = prevData.map(user =>
                        user.id === selectedUserId ? { ...user, ...formData } : user
                    );


                    setFilteredDataUsuarios(updatedUsuarios); // Actualizar filteredDataUsuarios también
                    return updatedUsuarios;
                });

                setIsModalOpenEdit(false); // Cerrar el modal
            } else {
                alert('Error al actualizar los datos.');
            }

            // Aquí podrías actualizar el estado de la lista de usuarios o hacer un refetch

            setIsModalOpenEdit(false); // Cerrar el modal
        } catch (error) {
            console.error("Error al actualizar el usuario:", error.response?.data || error.message);
            alert("Error al actualizar el usuario");
        }
    };
    const openNotification = (id) => {
        const key = `open${Date.now()}`;
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => holder.destroy()}>
                    Cancelar
                </Button>
                <Button type="primary" size="small" onClick={() => eliminarUsuario(id)}>
                    Eliminar
                </Button>
            </Space>
        );
        holder.open({
            message: `Eliminar Usuario `,
            description:
                'Esta seguro que desea eliminar el usuario?',
            btn,
            key,
            onClose: close,
        });
    };

    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchDiv = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        // Filtrar los datos originales
        if (searchValue === "") {
            // Si el campo de búsqueda está vacío, mostrar todos los datos originales
            setFilteredDataUsuarios(dataUsuarios);
        } else {
            const filtered = dataUsuarios.filter(user => {
                const fullName = `${user.nombre} ${user.apell_paterno} ${user.apell_materno}`.toLowerCase();
                return fullName.includes(searchValue);  // Verificar si el nombre completo contiene el término de búsqueda
            });
            setFilteredDataUsuarios(filtered);  // Actualizar los datos filtrados
        }
    };
    return (<>
        {contextHolder}
        <div className='p-10 '>
            <div className='flex justify-between items-center'>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscador"
                        value={searchTerm}
                        onChange={handleSearchDiv}
                        className="w-full px-4 py-2 rounded-lg border border-gray-400"
                    />
                </div>
                <Button onClick={showModal} color="primary" variant="solid">
                    Crear usuario
                </Button>
            </div>
            <Modal title="Crear usuario" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />

                    </>
                )}>
                <form className="mt-8 space-y-6" onSubmit={crearUsuario}>
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
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
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
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
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
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                            placeholder="ej. juan@gmail.com"
                            className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            required
                            placeholder="ej. juan@gmail.com"
                            className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Contraseña</label>
                            <input
                                type="password"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required
                                placeholder="Ingresa tu contraseña"
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            />
                            <p className="mt-2 text-sm text-gray-400">Debe tener al menos 8 caracteres.</p>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Tipo de Usuario</label>
                            <select
                                name="tipo_usuario"
                                value={formData.tipo_usuario}
                                required
                                onChange={handleChange}
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            >
                                <option value="cliente">Cliente</option>
                                <option value="administrador">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <button type='submit' className='px-3 py-2 bg-blue-500 text-white rounded-xl' >Guardar</button>


                </form>
            </Modal>
            <Table columns={columns} dataSource={filteredDataUsuarios} />
            <Modal title="Editar usuario" open={isModalOpenEdit} onOk={handleOkEdit} onCancel={handleCancelEdit}  footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />

                    </>
                )}>
                <form className="mt-8 space-y-6" onSubmit={editarUsuario}>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Nombres</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="ej. Juan"
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            />
                        </div>

                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Apellido Paterno</label>
                            <input
                                type="text"
                                name="apell_paterno"
                                value={formData.apell_paterno}
                                onChange={handleChange}
                                placeholder="ej. Juan"
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Apellido Materno</label>
                            <input
                                type="text"
                                name="apell_materno"
                                value={formData.apell_materno}
                                onChange={handleChange}
                                placeholder="ej. Pérez"
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="ej. juan@gmail.com"
                            className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            placeholder="ej. juan@gmail.com"
                            className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Contraseña</label>
                            <input
                                type="password"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                placeholder="Ingresa tu contraseña"
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Tipo de Usuario</label>
                            <select
                                name="tipo_usuario"
                                value={formData.tipo_usuario}
                                required
                                onChange={handleChange}
                                className="mt-2 w-full rounded-lg border border-gray-800 px-4 py-3 text-black focus:border-black focus:outline-none"
                            >
                                <option value="cliente">Cliente</option>
                                <option value="administrador">Administrador</option>
                            </select>
                        </div>

                    </div>
                    <button type='submit' className='px-3 py-2 bg-blue-500 text-white rounded-xl'>Guardar</button>


                </form>
            </Modal>
        </div>
    </>)
};
export default Modelo1;