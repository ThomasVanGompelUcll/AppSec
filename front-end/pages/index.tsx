import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import Footer from '@components/footer';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Home page</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <span>
          <Image
            src="/images/Naamloos.png"
            alt="Courses Logo"
            className={styles.vercelLogo}
            width={50}
            height={50}
          />
          <h1>Welcome!</h1>
        </span>

        <div className={styles.description}>
          <p>
            Courses lets you see as a lecturer all the courses you are teaching
            and as a student all the courses you are enrolled in. <br />
            You can also see when the courses are scheduled and the students
            enrolled in each course.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
