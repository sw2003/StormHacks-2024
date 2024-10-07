import Image from "next/image";
import styles from "./Instructions.module.css"; // Importing CSS module

export default function Page() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>LectureSync Instruction</h1>
                <p>Follow these instructions to get started with the app.</p>
            </header>

            <section className={styles.step}>
                <h2>1. Goto https://storm-hacks-2024.vercel.app/ and press Record</h2>
                <Image
                    src="/images/record.png"
                    alt="Record"
                    width={600}
                    height={300}
                    className={styles.image}
                />
            </section>

            <section className={styles.step}>
                <h2>2. Press the Stop recording button when all is done</h2>
                <p>You can record multiple clips by record and stop recording again and again</p>
                <Image
                    src="/images/stoprec.png"
                    alt="Stop Recording"
                    width={600}
                    height={300}
                    className={styles.image}
                />
            </section>

            <section className={styles.step}>
                <h2>3. Press the Create Notes button</h2>
                <p>Now the summarized notes will appear</p>
                <Image
                    src="/images/notes.png"
                    alt="Create Note"
                    width={600}
                    height={300}
                    className={styles.image}
                />
            </section>
        </div>
    );
}
