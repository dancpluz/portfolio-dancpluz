import Container from "@/components/blog/container";
import Loader from "@/components/ui/loader";

export default function Loading() {
  return (
    <Container divClassName="flex w-screen h-screen items-center justify-center p-0" mainClassName="border-none p-0 min-h-0 flex items-center justify-center">
      <Loader />
    </Container>
  );
}
