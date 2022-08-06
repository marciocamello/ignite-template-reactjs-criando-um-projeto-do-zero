import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { GetStaticPaths, GetStaticProps } from 'next';

import { format, formatRelative, minutesToHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

interface Content {
  heading: string;
  body: {
    text: string;
  }[];
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <h1>Carregando...</h1>;
  }

  function formatDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
  }

  function calculateReadingTime(content: Content[]): string {
    const getHeadingWordsPerMinutes = content.reduce((acc, currentValue) => {
      return currentValue.heading.split(/\s+/).length + acc;
    }, 0);

    const getBodyWordsPerMinutes = content.reduce((acc, currentValue) => {
      return RichText.asText(currentValue.body).split(/\s+/).length + acc;
    }, 0);

    const getWordsPerMinutes = Math.ceil(
      (getHeadingWordsPerMinutes + getBodyWordsPerMinutes) / 200
    );

    if (getWordsPerMinutes < 1) {
      return 'Rápida leitura';
    }

    if (getWordsPerMinutes < 60) {
      return `${getWordsPerMinutes} min`;
    }

    return `${minutesToHours(getWordsPerMinutes)} horas`;
  }

  return (
    <>
      <div className={commonStyles.container}>
        <Header />
      </div>
      <div className={styles.articleMain}>
        <img src={post.data.banner.url} alt="" />

        <main className={commonStyles.container}>
          <article className={styles.article}>
            <header>
              <h1>{post.data.title}</h1>
              <div className={styles.articleInfo}>
                <div>
                  <FiCalendar size={18} />
                  <time dateTime={post.first_publication_date}>
                    {formatDate(post.first_publication_date)}
                  </time>
                </div>
                <div>
                  <FiUser size={18} />
                  <span>{post.data.author}</span>
                </div>
                <div>
                  <FiClock size={18} />
                  <span>{calculateReadingTime(post.data.content)}</span>
                </div>
              </div>
              <span className={styles.lastUpdate}>
                * editado em{' '}
                {formatRelative(
                  new Date(post.first_publication_date),
                  new Date(),
                  { locale: ptBR }
                )}
              </span>
            </header>
            {post.data.content.map(content => (
              <section className={styles.articleContent} key={content.heading}>
                <h1>{content.heading}</h1>
                <div
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </section>
            ))}
          </article>
        </main>
      </div>
    </>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    fetch: ['posts.slug'],
  });

  const params = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths: params,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  const postData = {
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url ?? '',
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: content.body,
      })),
    },
    uid: response.uid,
    first_publication_date: response.first_publication_date,
  } as Post;

  return {
    props: {
      post: postData,
    },
    revalidate: 60 * 60 * 24,
  };
};
