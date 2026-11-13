import StatusMessage from "@/components/StatusMessage";
import s from "@/styles/status.module.css";

export default function Loading() {
    return (
        <StatusMessage title="불러오는 중" role="status">
            <div className={s.skeleton} style={{ width: "80%" }} />
            <div className={s.skeleton} style={{ width: "60%" }} />
            <div className={s.skeleton} style={{ width: "70%" }} />
        </StatusMessage>
    );
}
