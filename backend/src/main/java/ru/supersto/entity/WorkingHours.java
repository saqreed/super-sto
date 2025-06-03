package ru.supersto.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkingHours {
    private String start; // например "08:00"
    private String end; // например "20:00"
}