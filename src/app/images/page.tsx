import { redirect } from "next/navigation";

// 기존 이미지 페이지는 프로젝트 관리 페이지로 통합됨
export default function ImagesRedirect() {
    redirect("/manage");
}
