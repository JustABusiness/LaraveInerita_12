<?php

namespace App\Http\Requests\Language; 

use Illuminate\Support\Facades\Lang;
use Illuminate\Foundation\Http\FormRequest; 

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
             'name' => 'required|string|max:255',
             'canonical' => 'required|string|max:255',
             'description' => 'nullable|string',
             'image' => 'nullable|sometimes',
             'publish' => 'sometimes|required|in:1,2',
        ];
    } 

    public function attributes()
    {
        return [
            'name' => 'Tên ngôn ngữ',
            'canonical' => 'Từ khoá',
            'image' => 'Ảnh đại diện',
            'description' => 'Mô tả',
        ];
    }
}
