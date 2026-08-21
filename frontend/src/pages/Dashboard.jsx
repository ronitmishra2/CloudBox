import { useEffect, useState } from "react";
import {
    Upload,
    Search,
    FileText,
    Image,
    File,
    Trash2,
    Download,
    Pencil,
    Share2,
    HardDrive
} from "lucide-react";

import api from "../api/axios";

function Dashboard() {
    const [files, setFiles] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState({
        total_files: 0,
        storage_used: "0 Bytes",
        pdf_files: 0,
        image_files: 0,
        text_files: 0,
    });
    // Fetch user's files
    const fetchFiles = async () => {
        try {
            const response = await api.get("/files/");
            setFiles(response.data);
        } catch (error) {
            console.error("Failed to fetch files:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchStats = async () => {
        try {
            const response = await api.get("/files/stats");
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    // Upload file
    const handleUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);

            await api.post("/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            await fetchFiles();
            await fetchStats();

            alert("File uploaded successfully.");
        } catch (error) {
            console.error("Upload failed:", error);

            alert(
                error.response?.data?.error ||
                "File upload failed."
            );
        } finally {
            setUploading(false);

            // Allow selecting the same file again
            event.target.value = "";
        }
    };
    const handleDownload = async (fileId) => {
        try {
            const response = await api.get(`/files/download/${fileId}`);

            const downloadUrl = response.data.download_url;

            window.open(downloadUrl, "_blank");
        } catch (error) {
            console.error("Download failed:", error);

            alert(
                error.response?.data?.error ||
                "File download failed."
            );
        }
    };

    // Get appropriate icon
    const getFileIcon = (contentType) => {
        if (contentType?.startsWith("image/")) {
            return <Image size={22} />;
        }

        if (contentType === "application/pdf") {
            return <FileText size={22} />;
        }

        return <File size={22} />;
    };

    // Search files
    const filteredFiles = files.filter((file) =>
        file.filename
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Load files when dashboard opens
    useEffect(() => {
        fetchFiles();
        fetchStats();
    }, []);

    const handleDelete = async (fileId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this file?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/files/${fileId}`);

            await fetchFiles();
            await fetchStats();

            alert("File deleted successfully.");
        } catch (error) {
            console.error("Delete failed:", error);

            alert(
                error.response?.data?.error ||
                "File deletion failed."
            );
        }
    };
    const handleRename = async (fileId, currentFilename) => {
        const newFilename = window.prompt(
            "Enter the new filename:",
            currentFilename
        );

        if (!newFilename || newFilename === currentFilename) {
            return;
        }

        try {
            await api.patch(`/files/${fileId}`, {
                filename: newFilename,
            });

            await fetchFiles();

            alert("File renamed successfully.");
        } catch (error) {
            console.error("Rename failed:", error);

            alert(
                error.response?.data?.error ||
                "File rename failed."
            );
        }
    };
    const handleShare = async (fileId) => {
        try {
            const response = await api.post(`/share/${fileId}`);

            const shareUrl = response.data.share_url;

            await navigator.clipboard.writeText(shareUrl);

            alert("Share link copied to clipboard!");
        } catch (error) {
            console.error("Share failed:", error);

            alert(
                error.response?.data?.error ||
                "Failed to create share link."
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900">
                <div className="flex items-center justify-between px-8 py-4">

                    <h1 className="text-2xl font-bold">
                        Cloud<span className="text-blue-500">Box</span>
                    </h1>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/";
                        }}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Logout
                    </button>

                </div>
            </nav>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-8 py-8">

                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h2 className="text-3xl font-bold">
                            My Files
                        </h2>

                        <p className="mt-1 text-slate-400">
                            Manage your files in CloudBox
                        </p>
                    </div>

                    {/* Upload */}
                    <label
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 ${
                            uploading
                                ? "cursor-not-allowed opacity-70"
                                : ""
                        }`}
                    >
                        <Upload size={20} />

                        {uploading
                            ? "Uploading..."
                            : "Upload File"}

                        <input
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>

                </div>
                {/* Statistics */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Total Files */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                Total Files
                            </p>

                            <File className="text-blue-400" size={20} />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {stats.total_files}
                        </p>
                    </div>

                    {/* Storage */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                Storage Used
                            </p>

                            <HardDrive className="text-green-400" size={20} />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {stats.storage_used}
                        </p>
                    </div>

                    {/* PDFs */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                PDF Files
                            </p>

                            <FileText className="text-red-400" size={20} />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {stats.pdf_files}
                        </p>
                    </div>

                    {/* Images */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                Images
                            </p>

                            <Image className="text-purple-400" size={20} />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {stats.image_files}
                        </p>
                    </div>

                    {/* Text */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                Text Files
                            </p>

                            <FileText className="text-yellow-400" size={20} />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {stats.text_files}
                        </p>
                    </div>

                </div>
                {/* Search */}
                <div className="relative mt-8">

                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        type="text"
                        placeholder="Search files..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500"
                    />

                </div>

                {/* Files */}
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

                    {loading ? (

                        <div className="p-10 text-center text-slate-400">
                            Loading files...
                        </div>

                    ) : filteredFiles.length === 0 ? (

                        <div className="p-10 text-center">

                            <File
                                size={40}
                                className="mx-auto text-slate-600"
                            />

                            <p className="mt-4 text-slate-400">
                                No files found
                            </p>

                        </div>

                    ) : (

                        <div>

                            {filteredFiles.map((file) => (

                                <div
                                    key={file.id}
                                    className="flex items-center justify-between border-b border-slate-800 p-5 last:border-0 hover:bg-slate-800/50"
                                >

                                    {/* File information */}
                                    <div className="flex items-center gap-4">

                                        <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
                                            {getFileIcon(
                                                file.content_type
                                            )}
                                        </div>

                                        <div>

                                            <p className="font-medium">
                                                {file.filename}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {file.content_type}
                                            </p>

                                        </div>

                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => handleDownload(file.id)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                                            title="Download"
                                        >
                                            <Download size={19} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRename(file.id, file.filename)
                                            }
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                                            title="Rename"
                                        >
                                            <Pencil size={19} />
                                        </button>

                                        <button
                                            onClick={() => handleShare(file.id)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                                            title="Share"
                                        >
                                            <Share2 size={19} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(file.id)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 size={19} />
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default Dashboard;