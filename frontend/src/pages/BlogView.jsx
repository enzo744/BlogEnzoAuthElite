import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Share2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { getData } from "@/context/userContext";

const BlogView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const { blog } = useSelector((store) => store.blog);
  const { user } = getData();
  const selectedBlog = blog.find((blog) => blog._id === blogId);

  const HandlerBlogDetails = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Utente non autenticato.");
    }
    if (!user) {
      toast.error("Utente non autenticato.");
    }
    try {
      // const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://blogenzoauthelite.onrender.com/blog/${selectedBlog?._id}`,
        {
            headers: {
              Authorization: `Bearer ${accessToken}`, // ✅ Corretto: l'header va qui
            },
            withCredentials: true,
          }
        );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("it-IT", options);
    return formattedDate;
  };
  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this blog!",
          text: "Read this amazing blog post.",
          url: blogUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // fallback: copy to clipboard
      navigator.clipboard.writeText(blogUrl).then(() => {
        toast.success("Blog link copied to clipboard!");
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="pt-12 ">
      <div className="max-w-6xl mx-auto p-10">
        <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <Link to="/blogs" className="text-muted-foreground hover:text-foreground transition-colors">
              Blogs
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <span className="text-muted-foreground">{selectedBlog.title}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
        {/* Blog Header */}
        <div className="my-8 md:w-[760px] dark:bg-gray-900">
          <h1 className="text-4xl font-bold tracking-tight mb-4 dark:text-gray-400">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4 my-4 ">
            <div className="flex items-center space-x-4 font-serif ">
              <Avatar className="">
                <AvatarImage src={selectedBlog.author?.photoUrl} alt="Author" className="" />
                <AvatarFallback className="">JD</AvatarFallback>
              </Avatar>
              <div className="">
                <span className="font-sm text-blue-800 dark:text-gray-400 ">
                  {selectedBlog.author?.username} 
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground dark:text-gray-400 p-4 mx-4">
              Published on {changeTimeFormat(selectedBlog.createdAt)} 
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-6 rounded-lg md:w-[760px] overflow-hidden">
          <img
            src={selectedBlog?.thumbnail}
            alt="Next.js Development"
            className="w-fit object-scale-down "
          />
          <span className="">
            {selectedBlog.subtitle}
          </span>
        </div>

        <span
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
        ></span>

        <div className="mt-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">Web Development</Badge>
            <Badge variant="secondary">JavaScript</Badge>
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-400 py-4 mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={HandlerBlogDetails}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                >
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 ">
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleShare(selectedBlog._id)}
                variant="ghost"
                size="lg"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
