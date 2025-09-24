import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Badge } from "src/components/ui/badge";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Label } from "src/components/ui/label";
import { Plus, Edit, Trash2, Eye, Calendar, User, Upload, X, Image, FolderPlus } from "lucide-react";
import SEOAnalyzer from "src/components/seo/SEOAnalyzer";
import { z } from "zod";
import { apiRequest, queryClient } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import { ArticleWithAuthor, Category } from "@shared/schema";
import AstroTickHeader from "src/components/layout/AstroTickHeader";

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },

  // Indian Languages
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'si', name: 'Sinhala (සිංහල)' },
  { code: 'sd', name: 'Sindhi (سنڌي)' },
  { code: 'ks', name: 'Kashmiri (کٲشُر)' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)' },

  // International Languages
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'ms', name: 'Malay (Bahasa Melayu)' }
];

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  language: z.string().min(1, "Language is required"),
  parentArticleId: z.number().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function AdminArticles() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleWithAuthor | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const { toast } = useToast();

  const { data: articles = [], isLoading: articlesLoading } = useQuery<ArticleWithAuthor[]>({
    queryKey: ["/api/admin/articles"],
  });

  const { data: categories = [], refetch: refetchCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache category data (updated from cacheTime)
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
      language: "en",
    },
  });

  // Improved image upload handler with server upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error", 
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive", 
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem("token");
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const imageUrl = result.imageUrl;
      
      setUploadedImage(imageUrl);
      form.setValue("featuredImage", imageUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      // Fallback to data URL if server upload fails
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setUploadedImage(imageUrl);
          form.setValue("featuredImage", imageUrl);
          toast({
            title: "Success",
            description: "Image uploaded successfully (local)",
          });
        };
        reader.readAsDataURL(file);
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Category creation handler
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      // Force refresh categories immediately
      await refetchCategories();
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setShowCreateCategory(false);
      setNewCategoryName("");
      // Update the form to use the newly created category
      if (data.category) {
        form.setValue("category", data.category.name);
      }
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      console.error("Category creation error:", error);
      toast({
        title: "Category Creation Failed", 
        description: error.message || "Unable to create category",
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    createCategoryMutation.mutate(newCategoryName.trim());
  };

  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(",").map((tag: string) => tag.trim()) : [],
        }),
      });
      if (!response.ok) throw new Error("Failed to create article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setIsCreateOpen(false);
      form.reset();
      setUploadedImage("");
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ArticleFormData }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(",").map((tag: string) => tag.trim()) : [],
        }),
      });
      if (!response.ok) throw new Error("Failed to update article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setEditingArticle(null);
      form.reset();
      setUploadedImage("");
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete article");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: ArticleWithAuthor) => {
    setEditingArticle(article);
    setUploadedImage(article.featuredImage || "");
    form.reset({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
      featuredImage: article.featuredImage || "",
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || "",
      status: article.status as "draft" | "published",
      language: (article as any).language || "en",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLanguageFilter = (languageCode: string, checked: boolean) => {
    if (languageCode === "all") {
      setSelectedLanguages(["all"]);
    } else {
      setSelectedLanguages([languageCode]);
    }
  };

  const filteredArticles = articles.filter(article => {
    if (selectedLanguages.includes("all") || selectedLanguages.length === 0) {
      return true;
    }
    return selectedLanguages.includes((article as any).language || "en");
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-y-auto">
      <AstroTickHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Article Management</h1>
            <p className="text-gray-600 mt-2">Create and manage multilingual blog articles</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Article
          </Button>
        </div>

        {/* Language Filter Dropdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter by Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="language-select" className="text-sm font-medium">
                Select Language:
              </Label>
              <Select 
                value={selectedLanguages.includes("all") ? "all" : selectedLanguages[0] || "en"} 
                onValueChange={(value) => handleLanguageFilter(value, true)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isCreateOpen || !!editingArticle} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingArticle(null);
            form.reset();
            setUploadedImage("");
          }
        }}>
          <DialogTrigger asChild>
            <span></span>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Edit Article" : "Create New Article"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          Category
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCreateCategory(true)}
                            className="text-xs"
                          >
                            <FolderPlus className="w-3 h-3 mr-1" />
                            New
                          </Button>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category: Category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showCreateCategory && (
                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">Create New Category</h4>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                        />
                        <Button 
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={createCategoryMutation.isPending}
                          size="sm"
                        >
                          {createCategoryMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowCreateCategory(false);
                            setNewCategoryName("");
                          }}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <div data-color-mode="light">
                          <MDEditor
                            value={field.value}
                            onChange={(value) => field.onChange(value || "")}
                            preview="live"
                            hideToolbar={false}
                            visibleDragbar={false}
                            data-color-mode="light"
                            textareaProps={{
                              placeholder: "Write your article content here. Use markdown formatting: **bold**, *italic*, # headers, [links](url), etc. Rich text will be converted to markdown when pasted.",
                              style: { 
                                fontSize: '14px',
                                lineHeight: '1.6',
                                fontFamily: 'inherit'
                              },
                              spellCheck: false,
                              onPaste: (e) => {
                                // Handle rich text paste by converting HTML to markdown
                                const clipboardData = e.clipboardData;
                                if (!clipboardData) return;
                                
                                e.preventDefault();
                                
                                // Try to get HTML content first, then fall back to plain text
                                let pasteContent = clipboardData.getData('text/html');
                                if (!pasteContent) {
                                  pasteContent = clipboardData.getData('text/plain');
                                }
                                
                                // Basic HTML to markdown conversion
                                if (pasteContent.includes('<')) {
                                  pasteContent = pasteContent
                                    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
                                    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
                                    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
                                    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
                                    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
                                    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
                                    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
                                    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
                                    .replace(/<p[^>]*>/gi, '\n')
                                    .replace(/<\/p>/gi, '\n')
                                    .replace(/<br[^>]*>/gi, '\n')
                                    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
                                    .replace(/\n\s*\n/g, '\n\n') // Clean up extra newlines
                                    .trim();
                                }
                                
                                const textarea = e.target as HTMLTextAreaElement;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const before = field.value.substring(0, start);
                                const after = field.value.substring(end);
                                
                                field.onChange(before + pasteContent + after);
                                
                                setTimeout(() => {
                                  textarea.selectionStart = textarea.selectionEnd = start + pasteContent.length;
                                }, 10);
                              }
                            }}
                            height={400}
                            data-testid="md-editor"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="tag1, tag2, tag3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SUPPORTED_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Image Upload Section */}
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field}
                              value={uploadedImage || field.value || ""}
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                              />
                              <Button type="button" disabled={isUploading} className="relative">
                                {isUploading ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                <span className="ml-2">Upload</span>
                              </Button>
                            </div>
                          </div>
                          {(uploadedImage || field.value) && (
                            <div className="relative inline-block">
                              <img 
                                src={uploadedImage || field.value} 
                                alt="Featured" 
                                className="w-32 h-32 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2"
                                onClick={() => {
                                  setUploadedImage("");
                                  field.onChange("");
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO title (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="SEO description (optional)"
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEditingArticle(null);
                      form.reset();
                      setUploadedImage("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : 
                     editingArticle ? "Update Article" : "Create Article"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {articlesLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredArticles.map((article: ArticleWithAuthor) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author.username}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.viewCount} views
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {SUPPORTED_LANGUAGES.find(lang => lang.code === (article as any).language)?.name || 'English'}
                          </span>
                        </div>
                        {article.featuredImage && (
                          <div className="flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            <span className="text-xs">Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline">{article.category}</Badge>
                      {article.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}