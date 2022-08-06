import { FiCalendar, FiUser } from 'react-icons/fi';

import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <header className={styles.header}>
        <img src="/assets/logo.svg" alt="" />
      </header>
      <main className={styles.articles}>
        <article className={styles.article}>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.articleInfo}>
            <div>
              <FiCalendar size={18} />
              <time dateTime="2020-01-01">15 Mar 2021</time>
            </div>
            <div>
              <FiUser size={18} /> <span>Joseph Oliveira</span>
            </div>
          </div>
        </article>
        <article className={styles.article}>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.articleInfo}>
            <div>
              <FiCalendar size={18} />
              <time dateTime="2020-01-01">15 Mar 2021</time>
            </div>
            <div>
              <FiUser size={18} /> <span>Joseph Oliveira</span>
            </div>
          </div>
        </article>
        <article className={styles.article}>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.articleInfo}>
            <div>
              <FiCalendar size={18} />
              <time dateTime="2020-01-01">15 Mar 2021</time>
            </div>
            <div>
              <FiUser size={18} /> <span>Joseph Oliveira</span>
            </div>
          </div>
        </article>
      </main>
      <div className={styles.loadingMoreArticles}>
        <button type="button">Carregar mais artigos</button>
      </div>
      <div className={styles.previewButton}>
        <button type="button">Sair do modo Preview</button>
      </div>
    </div>
  );
}

// export const getStaticProps = async () => {
// const prismic = getPrismicClient({});
// const postsResponse = await prismic.getByType(TODO);

// TODO
// };
