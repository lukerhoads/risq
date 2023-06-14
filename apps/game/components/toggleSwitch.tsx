import styles from '../styles/toggleSwitch.module.scss';

interface ToggleSwitchProps {
  value: boolean;
  toggleValue: () => void;
}

export default function ToggleSwitch({
  value,
  toggleValue,
}: ToggleSwitchProps) {
  return (
    <>
      <label className={styles.switch}>
        <input type="checkbox" checked={value} onChange={() => toggleValue()} />
        <span className={styles.slider}></span>
      </label>
    </>
  );
}
