import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { GetStaticPaths, GetStaticProps } from 'next';

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

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <div className={commonStyles.container}>
        <Header />
      </div>
      <div className={styles.articleMain}>
        <img src="/assets/logo.svg" alt="" />

        <main className={commonStyles.container}>
          <article className={styles.article}>
            <header>
              <h1>Como utilizar Hooks</h1>
              <div className={styles.articleInfo}>
                <div>
                  <FiCalendar size={18} />
                  <time dateTime="2020-01-01">15 Mar 2021</time>
                </div>
                <div>
                  <FiUser size={18} /> <span>Joseph Oliveira</span>
                </div>
                <div>
                  <FiClock size={18} /> <span>4 min</span>
                </div>
              </div>
              <span className={styles.lastUpdate}>
                * editado em 19 mar 2021, às 15:49
              </span>
            </header>

            <section className={styles.articleContent}>
              {/* <h2>Proin et varius</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                dolor sapien, vulputate eu diam at, condimentum hendrerit
                tellus. Nam facilisis sodales felis, pharetra pharetra lectus
                auctor sed. Ut venenatis mauris vel libero pretium, et pretium
                ligula faucibus. Morbi nibh felis, elementum a posuere et,
                vulputate et erat. Nam venenatis.
              </p> */}
            </section>
          </article>
        </main>
      </div>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient({});
//   const posts = await prismic.getByType(TODO);

//   // TODO
// };

// export const getStaticProps = async ({params }) => {
//   const prismic = getPrismicClient({});
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
