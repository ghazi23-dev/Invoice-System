/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns,faFileInvoiceDollar ,faCashRegister, faBuilding,faListUl,faMoneyBill,faUsers,faSackDollar,faCubesStacked,faTimeline,faCirclePlus,faWarehouse,faHistory,faFilePdf,faHandHoldingDollar } 
  from '@fortawesome/free-solid-svg-icons';
import { HomeOutlined, UsergroupDeleteOutlined,  SettingOutlined ,} from '@ant-design/icons';
import './Sidebar.css';



const MenuList = ({ darkTheme }) => {
const [isAdmin, setIsAdmin] = useState(false);



useEffect(() => {
  const fetchUserRole = async () => {
    try {
      // Get user details from local storage
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));

      if (userDetails) {
        const { Role } = userDetails;
        // Check user role and set isAdmin state accordingly
        setIsAdmin(Role === "Owner");
        console.log("User Role GHAZI:", Role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };
  fetchUserRole();
}, []);





  return (
    <Menu theme={darkTheme ? 'dark' : 'light'} mode='inline' className='menu-bar'>
       {(!isAdmin) ? (
        <Menu.Item key="HomeAgent" icon={<HomeOutlined />}>
        <Link to="/Dashboard/Home/Agent">Dashboard</Link>
      </Menu.Item>
       ) : null}
        {(isAdmin) ? (
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/Dashboard/Home">Dashboard</Link>
      </Menu.Item>
            ) : null}

{(isAdmin) ? (
      <Menu.Item key="Agence"icon={<FontAwesomeIcon icon={faBuilding} />} >
        <Link to="/Dashboard/Agence">Agence</Link>
      </Menu.Item>
            ) : null}

{(isAdmin) ? (
      <Menu.Item key="Facturation"icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />} >
        <Link to="/Dashboard/DashboardBi">Facturation</Link>
      </Menu.Item>
            ) : null}

{(isAdmin) ? (
      <Menu.Item key="Produit_Reservation"icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />} >
        <Link to="/Dashboard/Produit_Reservation">Produit Reservation</Link>
      </Menu.Item>
            ) : null}

      {(isAdmin) ? (
        <Menu.Item key="employer" icon={<UsergroupDeleteOutlined />}>
          <Link to="/Dashboard/Agent">Agent</Link>
        </Menu.Item>
      ) : null}
   
<Menu.SubMenu key='trésorerie' title="Trésorerie" icon={<FontAwesomeIcon icon={faSackDollar} />} >
{(isAdmin) ? (
  <Menu.SubMenu key="caisse" title="caisse" icon={<FontAwesomeIcon icon={faCashRegister} />}>
    <Menu.Item key="caisse" icon={<FontAwesomeIcon icon={faMoneyBill} />}>
      <Link to="/Dashboard/tresorerie/caisse/">Caisse</Link>
    </Menu.Item>
    <Menu.Item key="historique_caisse" icon={<FontAwesomeIcon icon={faTimeline} />}>
      <Link to="/Dashboard/tresorerie/historique_caisse/">Historique</Link>
    </Menu.Item>
  </Menu.SubMenu>
 ) : null}

 {(isAdmin) ? (
  <Menu.Item key="banque" icon={<FontAwesomeIcon icon={faBuildingColumns} />}>
    <Link to="/Dashboard/tresorerie/banque">Banque</Link>
  </Menu.Item>
   ) : null}
 

  <Menu.SubMenu key="reglement" title="Reglement" icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}>

  <Menu.Item key="Historique_Reglement" icon={<FontAwesomeIcon icon={faListUl} />}>
    <Link to="/Dashboard/tresorerie/historique_reglement">Reglements</Link>
  
  </Menu.Item>
  {(isAdmin) ? (
    <Menu.Item key="rapport_pdf_reglement" icon={<FontAwesomeIcon icon={faFilePdf} />}>
      <Link to="/Dashboard/tresorerie/historique_reglement/Rapport_PDF">Rapport PDF</Link>
    </Menu.Item>
  ) : null}
  </Menu.SubMenu>


  
</Menu.SubMenu>


      <Menu.SubMenu key='produits' title="Produits" icon={<FontAwesomeIcon icon={faCubesStacked} />} >
        <Menu.Item key="produits" icon={<FontAwesomeIcon icon={faCirclePlus} />}>
          <Link to="/Dashboard/produits/ajouter-produits">Ajouter Produit</Link>
        </Menu.Item>
        <Menu.Item key="stock" icon={<FontAwesomeIcon icon={faWarehouse} />}>
          <Link to="/Dashboard/produits/stock">Stock</Link>
        </Menu.Item>
        {(isAdmin) ? (
        <Menu.Item key="Historique Stock" icon={<FontAwesomeIcon icon={faHistory} />}>
          <Link to="/Dashboard/produits/historique-stock">Historique stock</Link>
        </Menu.Item>
          ) : null}
      </Menu.SubMenu>
     
      <Menu.Item key="fournisseur" icon={<FontAwesomeIcon icon={faUsers} />}>
        <Link to="/Dashboard/Fournisseur">Fournisseur</Link>
      </Menu.Item>
     
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/Dashboard/Parametre">Paramètres</Link>
      </Menu.Item>
    </Menu>
  );
  
};

export default MenuList;