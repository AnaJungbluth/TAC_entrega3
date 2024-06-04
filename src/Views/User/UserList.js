// import { useEffect, useState } from "react"
// import { URL_API } from "../../Const"

// function Pagination({ pages, changeActivePage, changePerPege, activePage }) {
//     const itens = [] // Itens de paginação

//     for (let i = 0; i < pages; i++) {
//         itens.push(
//             <li className={"page-item" + (activePage === i + 1 ? "active" : '')} key={i}>
//                 <button className="page-link" onClick={() => changeActivePage(i + 1)}>{i + 1}</button>
//             </li>
//         )
//     }

//     return (
//         <nav aria-label="Page navigation example">
//             <ul className="pagination justify-content-center">
//                 {itens}

//                 <li>
//                     <select className="form-select ms-2" onChange={changePerPege}>
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                         <option value={15}>15</option>
//                     </select>
//                 </li>
//             </ul>
//         </nav>
       
//     )
// }

// function UserList() {
//     // Definição de estados para o componente de UserList
//     const [activePage, setActivePage] = useState(1) // Página ativa
//     const [perPage, setPerPage] = useState(5) // Elementos por página
//     const [data, setData] = useState([] | {}); // Dados de usuário

//     // Definição de Efeito colateral para o componente UserList
//     //arg1: Função que será executada quando o effect for acionado
//     //arg2: Lista de estados que, quando aletardos, invocarão este effect.
//     useEffect(() => {
//         // Invocar a API
//         fetch(`${URL_API}users?page=${activePage}&per_page=${perPage}`)
//             .then(response => response.json())
//             .then(res => {
//                 // Mudar o estado do componente, setando a variável 
//                 // data
//                 setData(res)
//             })
//             .catch(e => console.log(e));
//     }, [activePage, perPage]);

//     // Função para ser executada quando mudar o número da págian ativa
//     function handleChangeActivePage(page = 1) {
//         setActivePage(page)
//     }

//     // Função para ser executada quando mudar a quantidade de elementos da por página
//     function handleChangePerPage(event) {
//         setPerPage(event.target.value)
//     }

//     return (
//         <>
//             <h2>Usuários</h2>
//             <table className="table table-striped">
//                 <thead>
//                     <tr>
//                         <th></th>
//                         <th>Nome</th>
//                         <th>E-mail</th>
//                         <th>Ações</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {data?.data?.map(pes => (
//                         <tr key={pes.id}>
//                             <td><img width={50} src={pes.avatar} alt={pes.fisrt_name} /></td>
//                             <td>{pes.first_name}{pes.last_name}</td>
//                             <td>{pes.email}</td>
//                             <td>
//                                 <button className="btn btn-secondary" value={pes.id}>Edit</button>
//                                 <button className="btn btn-secondary mx-1">Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <Pagination
//                 pages={data.total_pages}
//                 activePage={activePage}
//                 changeActivePage={handleChangeActivePage}
//                 changePerPege={handleChangePerPage}
//             />
//         </>
//     )
// }

// export default UserList