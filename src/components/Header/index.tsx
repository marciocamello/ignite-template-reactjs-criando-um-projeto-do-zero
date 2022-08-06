import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <img src="/assets/logo.svg" alt="" />
    </header>
  );
}
