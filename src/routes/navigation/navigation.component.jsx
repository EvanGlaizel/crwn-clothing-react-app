import { Fragment, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';

import { ReactComponent as CrwnLogo} from '../../assets/crown.svg'
import { UserContext } from '../../contexts/user.context';
import { CartContext } from '../../contexts/cart.context'

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import { NavigationContainer, NavLinksContainer, NavLink, LogoContainer } from './navigation.styles.jsx'

const Navigation = () => {

  //How to get the data of a context
  const { currentUser } = useContext(UserContext);
  const { isCartOpen } = useContext(CartContext);

  return (
    <Fragment   >
      <NavigationContainer>
        <LogoContainer to='/'>
            <CrwnLogo className='logo'/>
        </LogoContainer>
        <NavLinksContainer>
            <NavLink to='/shop'>SHOP</NavLink>

            {
              currentUser ? (<NavLink onClick={signOutUser}>SIGN OUT</NavLink>) : (<NavLink to='/auth'>SIGN IN</NavLink>)
            }
              <CartIcon/>
        </NavLinksContainer>
        {isCartOpen && <CartDropdown/>}
        </NavigationContainer>
      <Outlet/>
    </Fragment>
  )
}

export default Navigation;