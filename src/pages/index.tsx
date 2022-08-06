import { FiCalendar, FiLoader, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import { GetStaticProps } from 'next';
import { Head } from 'next/document';
import Header from '../components/Header';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPosts, setNextPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function formatDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
  }

  async function handleSeeMore(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await fetch(nextPage);
      const data = await response.json();

      setNextPage(data.next_page);

      const posts: Post[] = data.results.map(
        post =>
          ({
            uid: post.uid,
            data: {
              author: post.data.author,
              title: post.data.title,
              subtitle: post.data.subtitle,
            },
            first_publication_date: post.first_publication_date,
          } as Post)
      );
      setIsLoading(false);
      setNextPosts(prevState => [...prevState, ...posts]);
    } catch (err) {
      throw new Error(err);
    }
  }

  return (
    <div className={commonStyles.container}>
      <Header />
      <main className={styles.articles}>
        {nextPosts.map(item => (
          <Link href={`post/${item.uid}`} key={item.uid}>
            <article className={styles.article}>
              <h1>{item.data.title}</h1>
              <p>{item.data.subtitle}</p>
              <div className={styles.articleInfo}>
                <div>
                  <FiCalendar size={18} />
                  <time dateTime={item.first_publication_date}>
                    {formatDate(item.first_publication_date)}
                  </time>
                </div>
                <div>
                  <FiUser size={18} />
                  <span>{item.data.author}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </main>
      {nextPage && (
        <div className={styles.loadingMoreArticles}>
          <button type="button" onClick={handleSeeMore}>
            Carregar mais artigos
          </button>
        </div>
      )}
      {/* <div className={styles.previewButton}>
        <button type="button">Sair do modo Preview</button>
      </div> */}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'post.uid'],
    pageSize: 1,
  });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
