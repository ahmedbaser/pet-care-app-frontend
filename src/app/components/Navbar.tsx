// src/components/Navbar.tsx
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <nav>
      <Link href="/">Home</Link>
      {isAuthenticated ? (
        <>
          <Link href="/post">Posts</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
