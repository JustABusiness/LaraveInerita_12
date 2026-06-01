<?php

namespace App\Http\Requests\User\User;

use Illuminate\Foundation\Http\FormRequest;

class BulkDestroyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'ids.required' => 'Bạn chưa chọn bản ghi nào để xoá',
            'ids.array' => 'Dữ liệu không hợp lệ',
            'ids.*.integer' => 'ID bản ghi không hợp lệ',
            'ids.*.exists' => 'Bản ghi không tồn tại',
        ];
    }
}
