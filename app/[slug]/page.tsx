const contentMap: {
  [key: string]: string;
} = {
  page1: "page1 content",
};

const page = ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;

  return <div>{contentMap[slug]}</div>;
};
export default page;
