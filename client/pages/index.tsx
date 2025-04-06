import React from "react";
import { NextPage } from "next";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import styles from "../style/Home.module.css";

const Home: NextPage = () => {
  const { publicKey } = useWallet();

  return (
    <div className={styles.App}>
      {/* Header Section */}

      {/* Hero Section */}
      <main className={styles.AppBody}>
        <img
          src="\image.png"
          alt="VoteChain Logo"
          className={styles["logo-icon"]}
        />
        <h1 className={styles.AppTitle}>VoteChain</h1>
        <p className={styles.AppSubtitle}>Empowering Trust, One Vote at a Time</p>

        {/* Call-to-Action Section */}
        <div className={styles["welcome-box"]}>
          <p className={styles["welcome-text"]}>
            {publicKey ? "Welcome, Start Voting!" : "Connect your wallet to get started."}
          </p>
          {publicKey && (
            <Link href="/getStarted" passHref>
              <button className={styles["start-button"]}>Start</button>
            </Link>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className={styles.AppFooter}>
        <p>© 2025 VoteChain. All rights reserved.</p>
        <div className={styles.teamSection}>

          <ul>
            <li>Team - VoteVanguard</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;