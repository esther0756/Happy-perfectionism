import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="eyebrow">잠시 다른 길로 왔네요</span>
      <h1>이 페이지를 찾을 수 없어요.</h1>
      <p>첫 화면에서 다시 천천히 시작해볼까요?</p>
      <Link className="button primary" href="/">
        나의 작은 출발로 돌아가기
      </Link>
    </div>
  );
}
