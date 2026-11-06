import Link from "next/link";
import StatusMessage from "@/components/StatusMessage";
import s from "@/styles/status.module.css";

export default function NotFound() {
    return (
        <StatusMessage title="페이지를 찾을 수 없습니다">
            <p>주소가 바뀌었거나 삭제된 페이지입니다.</p>
            <div className={s.actions}>
                <Link className={`${s.btn} ${s.btnPrimary}`} href="/profile">프로필로 이동</Link>
            </div>
        </StatusMessage>
    );
}
