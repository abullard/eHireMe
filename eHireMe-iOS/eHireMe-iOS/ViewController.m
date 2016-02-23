//
//  ViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/19/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "ViewController.h"
#import <AFNetworking.h>

#include "EHMConstants.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)loginButtonPressed:(UIButton *)sender {
    NSString *email = self.emailTextField.text;
    NSString *password = self.passwordTextField.text;
    
    if (email.length == 0 || password.length == 0) {
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Hey!" message:@"Fill out the form plz.." preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
        [alertController addAction:ok];
        [self presentViewController:alertController animated:YES completion:nil];
        
        return;
    }
    
    NSDictionary *userInfo = @{@"email" : email, @"password" : password};
    
    NSString *urlStr = [NSString stringWithFormat:@"%@/applicants/login", baseURL];
    
    AFHTTPSessionManager *manager = [[AFHTTPSessionManager alloc]initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];

    [manager POST:urlStr parameters:userInfo progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSLog(@"%@", responseObject);
        
        if (responseObject != nil) {
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            [defaults setObject:[responseObject objectForKey:@"id"] forKey:@"EHMUser_ID"];
            [defaults setObject:[responseObject objectForKey:@"email"] forKey:@"EHMUser_Email"];
            [defaults synchronize];
            
            [self performSegueWithIdentifier:@"ToSwipeView" sender:self];
        } else {
            NSLog(@"Error invalid info");
            [[[UIAlertView alloc] initWithTitle:@"Invalid email or password" message:@"Please try again" delegate:nil cancelButtonTitle:@"Ok" otherButtonTitles:nil] show];
        }


    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"error: %@", error);
    }];
}

@end
