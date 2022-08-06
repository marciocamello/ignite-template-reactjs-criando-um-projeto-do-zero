import Link from 'next/link';
import styles from './header.module.scss';

interface HeaderProps {
  href?: string;
}

export default function Header({ href = '/' }: HeaderProps): JSX.Element {
  return (
    <header className={styles.header}>
      <Link href={href}>
        <img src="/assets/logo.svg" alt="logo" />
      </Link>
    </header>
  );
}
