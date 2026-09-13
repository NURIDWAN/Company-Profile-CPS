import { ConfirmDelete, TextField } from '@/components/admin/form-fields';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { RichText } from '@/components/public/rich-text';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product, type ProductCategory, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories & Products', href: '/admin/categories' },
];

export default function Categories({ categories }: { categories: ProductCategory[] }) {
    const { flash } = usePage<SharedData>().props;

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

    const [productTarget, setProductTarget] = useState<ProductCategory | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productOpen, setProductOpen] = useState(false);

    const categoryForm = useForm<{ name: string; description: string }>({ name: '', description: '' });
    const productForm = useForm<{ name: string; spec: string; description: string }>({ name: '', spec: '', description: '' });

    const openCategoryCreate = () => {
        setEditingCategory(null);
        categoryForm.reset();
        setCategoryOpen(true);
    };

    const openCategoryEdit = (category: ProductCategory) => {
        setEditingCategory(category);
        categoryForm.setData({ name: category.name, description: category.description ?? '' });
        setCategoryOpen(true);
    };

    const submitCategory: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(route('admin.categories.update', editingCategory.id), {
                onSuccess: () => setCategoryOpen(false),
            });
        } else {
            categoryForm.post(route('admin.categories.store'), { onSuccess: () => setCategoryOpen(false) });
        }
    };

    const openProductCreate = (category: ProductCategory) => {
        setProductTarget(category);
        setEditingProduct(null);
        productForm.reset();
        setProductOpen(true);
    };

    const openProductEdit = (category: ProductCategory, product: Product) => {
        setProductTarget(category);
        setEditingProduct(product);
        productForm.setData({ name: product.name, spec: product.spec ?? '', description: product.description ?? '' });
        setProductOpen(true);
    };

    const submitProduct: FormEventHandler = (e) => {
        e.preventDefault();
        if (!productTarget) return;
        if (editingProduct) {
            productForm.put(route('admin.products.update', editingProduct.id), {
                onSuccess: () => setProductOpen(false),
            });
        } else {
            productForm.post(route('admin.categories.products.store', productTarget.id), {
                onSuccess: () => setProductOpen(false),
            });
        }
    };

    const destroyCategory = (category: ProductCategory) => router.delete(route('admin.categories.destroy', category.id));

    const destroyProduct = (product: { id: number }) => router.delete(route('admin.products.destroy', product.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories & Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Categories & Products</h2>
                        <p className="text-muted-foreground text-sm">
                            Manage product categories and their products ({categories.length} categories).
                        </p>
                    </div>
                    <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCategoryCreate}>Add Category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submitCategory} className="space-y-4">
                                <TextField
                                    id="category-name"
                                    label="Name"
                                    value={categoryForm.data.name}
                                    onChange={(v) => categoryForm.setData('name', v)}
                                    error={categoryForm.errors.name}
                                    required
                                />
                                <RichTextEditor
                                    id="category-description"
                                    label="Description"
                                    value={categoryForm.data.description}
                                    onChange={(value) => categoryForm.setData('description', value)}
                                    error={categoryForm.errors.description}
                                />
                                <DialogFooter>
                                    <Button type="submit" disabled={categoryForm.processing}>
                                        {editingCategory ? 'Update' : 'Create'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">{flash.success}</div>
                )}

                <div className="space-y-4">
                    {categories.map((category) => (
                        <div key={category.id} className="rounded-lg border">
                            <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                                <div>
                                    <h3 className="font-semibold">{category.name}</h3>
                                    <RichText value={category.description} className="text-muted-foreground text-sm" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => openProductCreate(category)}>
                                        Add Product
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => openCategoryEdit(category)}>
                                        Edit
                                    </Button>
                                    <ConfirmDelete
                                        title="Delete category?"
                                        description={`This will permanently delete "${category.name}" and all its products.`}
                                        onDelete={() => destroyCategory(category)}
                                        trigger={
                                            <Button variant="destructive" size="sm">
                                                Delete
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                            <ul className="divide-y">
                                {category.products?.map((product) => (
                                    <li key={product.id} className="flex items-center justify-between px-5 py-3 text-sm">
                                        <div>
                                            <span className="font-medium">{product.name}</span>
                                            {product.spec && <span className="text-muted-foreground ml-3">{product.spec}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => openProductEdit(category, product)}>
                                                Edit
                                            </Button>
                                            <ConfirmDelete
                                                title="Delete product?"
                                                description={`This will permanently delete "${product.name}".`}
                                                onDelete={() => destroyProduct(product)}
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="text-red-600">
                                                        Delete
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </li>
                                ))}
                                {(category.products?.length ?? 0) === 0 && (
                                    <li className="text-muted-foreground px-5 py-3 text-sm">No products yet.</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product dialog (nested) */}
            <Dialog open={productOpen} onOpenChange={setProductOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : `Add Product to ${productTarget?.name ?? ''}`}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitProduct} className="space-y-4">
                        <TextField
                            id="product-name"
                            label="Name"
                            value={productForm.data.name}
                            onChange={(v) => productForm.setData('name', v)}
                            error={productForm.errors.name}
                            required
                        />
                        <TextField
                            id="product-spec"
                            label="Spec"
                            value={productForm.data.spec}
                            onChange={(v) => productForm.setData('spec', v)}
                            error={productForm.errors.spec}
                        />
                        <RichTextEditor
                            id="product-description"
                            label="Description"
                            value={productForm.data.description}
                            onChange={(value) => productForm.setData('description', value)}
                            error={productForm.errors.description}
                            rows={8}
                            uploadUrl={route('admin.products.upload-image')}
                            hint="You can insert images into the description."
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={productForm.processing}>
                                {editingProduct ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
