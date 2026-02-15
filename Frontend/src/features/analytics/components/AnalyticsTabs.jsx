import React from 'react';
import styles from '../styles/Analytics.module.css';

const AnalyticsTabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    className={`${styles.tab} ${activeTab === index ? styles.activeTab : ''}`}
                    onClick={() => onTabChange(index)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default AnalyticsTabs;
