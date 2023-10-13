import React, { useEffect, useState } from "react";
import { getBlogsByCount, removeBlog } from "../../functions/blog";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Pagination, Input } from 'antd';
import BlogCardV2 from "./BlogCardV2";
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'

const { Search } = Input;

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage, setBlogsPerPage] = useState(3);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAllBlogs();
    }, []);

    const loadAllBlogs = async () => {
        try {
            setLoading(true);
            const response = await getBlogsByCount(100);
            // Ensure that the response.data is an array, or set an empty array as a default value
            setBlogs(response.data || []);
        } catch (error) {
            console.error("Error loading blogs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (slug) => {
        try {
            if (window.confirm("Delete?")) {
                const response = await removeBlog(slug, user.token);
                loadAllBlogs();
                toast.error(`${response.data.title} is deleted`);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data);
            }
            console.error("Error removing blog", error);
        }
    };

    const handleChangePage = (page) => setCurrentPage(page);

    const handlePageSizeChange = (current, size) => {
        setBlogsPerPage(size);
        setCurrentPage(1);
    };

    const handleSearch = (value) => setSearchKeyword(value);

    const handleResetSearch = () => {
        setSearchKeyword("");
        loadAllBlogs();
    };

    // Ensure that blogs is always an array
    const filteredBlogs = Array.isArray(blogs)
        ? blogs.filter((blog) =>
            blog.title.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        : [];

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <div>
                            <div className="row mx-auto">
                                {currentBlogs.map((blog) => (
                                    <div key={blog._id} className="col-md-4 pb-3">
                                        <BlogCardV2 blog={blog} />
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                simple
                                current={currentPage}
                                total={filteredBlogs.length}
                                pageSize={blogsPerPage}
                                onChange={handleChangePage}
                                showSizeChanger
                                onShowSizeChange={handlePageSizeChange}
                                pageSizeOptions={['3']}
                                showQuickJumper
                                size="small"
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllBlogs;
