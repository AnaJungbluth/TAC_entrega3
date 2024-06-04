// import { useReducer, useState, useNavigate } from "react"
// import { URL_API } from "../../Const";
// import axios from "axios";

// class HTMLForm{
//     constructor(first_name = '', last_name = '', email = ''){
//         this.first_name = first_name
//         this.last_name = last_name
//         this.email = email
//     }
// }

// function UserForm() {
//     const nav = useNavigate()
//     // Estado para gerenciar a submissão do formulário
//     const [submitting, setSubmitting] = useState(false);

//     //Função redutora --> estado do formulário
//     const formReduce = (state, event) => {
//         if(event.reset){
//             return new HTMLForm()
//         }

//         return {
//             ...state,
//             [event.name]: event.value
//         }
//     }

//     // Reducer(estado complexo) para gerenciar dados do formulário
//     const [formData, setFormData] = useReducer(formReduce, new HTMLForm())// arg1 função redutora e arg2 estado inicial

//     // Função para salavr os dados do formulário
//     function handleSave(event){
//         console.log(event)

//         // Definir um estado de submissão do formulário
//         setSubmitting(true)

//         // Fazer a aquisição a API
//         axios.post(`${URL_API}users`, formData, {
//             headers: {
//                 "Content-type": "application/json",
//                 Authorization: "token JWT gerado no login"
//             }
//         }).then(res => {
//             console.log("Sucesso", res)
//             alert("Usuário salco com ID: ", res.data.id)
//             setFormData({reset: true})

//         }).catch(err => {
//             console.log(err)
//             alert("Falha ao salvar")
//         }).finally(() => setSubmitting(false))

//         // Desativar o estado da submissão do formulário
//         setSubmitting(false)
//     }

//     function handleChange(event){
//         // Trabalhar com CheckBox
//         //const isCheckBox = event.target.type == "checkbox"
//         setFormData({
//             name: event.target.name,
//             //value: event.target.value
//             //value: isCheckBox ? event.target.checked : event.target.value
//         })

//     }

//     return (
//         <>
//             <h2>Usuário</h2>

//             <form>
//                 <filsset className="form-group" disabled={submitting}>
//                     <label className="form-label">Primeiro nome</label>
//                     <input type="text" name="first_name" 
//                            className="form-control" placeholder="Ana" 
//                            value={formData.first_name} onChange={handleChange}/>
//                 </filsset>

//                 <filsset className="form-group" disabled={submitting}>
//                     <label className="form-label">Sobrenome</label>
//                     <input type="text" name="last_name" 
//                            className="form-control" placeholder="Sila" 
//                            value={formData.last_name} onChange={handleChange}/>
//                 </filsset>

//                 <filsset className="form-group" disabled={submitting}>
//                     <label className="form-label">E-mail</label>
//                     <input type="text" name="email" 
//                            className="form-control" placeholder="anaSila@hotmail.com" 
//                            value={formData.email} onChange={handleChange}/>
//                 </filsset>

//                 <div className="pagination justify-content-center mt-4">
//                     <button disabled={submitting} type="button" className="btn btn-success me-1" onClick={handleSave}>Salvar</button>
//                     <button disabled={submitting} type="button" className="btn btn-secondary" onClick={nav('/user')}>Cancelar</button>
//                 </div>
//             </form>
//         </>
//     )
// }

// export default UserForm