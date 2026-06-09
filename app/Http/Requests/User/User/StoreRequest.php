<?php

namespace App\Http\Requests\User\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'user_catalogue_ids' => 'required|array|min:1',
            'user_catalogue_ids.*' => 'exists:user_catalogues,id',
            'publish' => 'integer|in:1,2',
            'address' => 'nullable|string|max:255',
            'birthday' => 'nullable|date',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Bạn chưa nhập tên thành viên',
            'email.required' => 'Bạn chưa nhập email',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Bạn chưa nhập mật khẩu',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'user_catalogue_ids.required' => 'Bạn chưa chọn nhóm thành viên',
            'user_catalogue_ids.min' => 'Bạn chưa chọn nhóm thành viên',
        ];
    }
}
